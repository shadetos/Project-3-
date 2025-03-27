"""
Controller handling recipe-related operations
"""

from typing import Dict, Any, List, Optional
from bson import ObjectId
from fastapi import HTTPException, status

from config.database import get_collection
from models.recipe import (
    RecipeCreate,
    RecipeUpdate,
    RecipeResponse,
    recipe_to_db,
    db_to_recipe,
    RecipeGenerateRequest,
)
from services.recipe_service import generate_recipe, estimate_calories


async def create_recipe(recipe: RecipeCreate, user_id: str) -> Dict[str, Any]:
    """
    Create a new recipe in the database

    Args:
        recipe: Recipe data from request
        user_id: ID of user creating the recipe

    Returns:
        Created recipe document

    Raises:
        HTTPException: If creation fails
    """
    recipes_collection = get_collection("recipes")

    # Convert to database model
    recipe_db = recipe_to_db(recipe, user_id)

    # If no estimated calories provided, try to estimate
    if recipe.estimatedCalories is None:
        try:
            calories = await estimate_calories(recipe.name, recipe.ingredients)
            recipe_db["estimatedCalories"] = calories
        except:
            # If estimation fails, set to 0
            recipe_db["estimatedCalories"] = 0

    # Insert into database
    result = recipes_collection.insert_one(recipe_db)

    # Get the created recipe
    created_recipe = recipes_collection.find_one({"_id": result.inserted_id})

    if not created_recipe:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create recipe",
        )

    return created_recipe


async def get_recipe(recipe_id: str) -> Dict[str, Any]:
    """
    Get a recipe by ID

    Args:
        recipe_id: Recipe ID to retrieve

    Returns:
        Recipe document

    Raises:
        HTTPException: If recipe not found
    """
    recipes_collection = get_collection("recipes")

    try:
        recipe = recipes_collection.find_one({"_id": ObjectId(recipe_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid recipe ID format"
        )

    if recipe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )

    return recipe


async def update_recipe(
    recipe_id: str, update_data: RecipeUpdate, user_id: str
) -> Dict[str, Any]:
    """
    Update a recipe's information

    Args:
        recipe_id: Recipe ID to update
        update_data: New recipe data
        user_id: ID of user making the update

    Returns:
        Updated recipe document

    Raises:
        HTTPException: If recipe not found or user is not the creator
    """
    recipes_collection = get_collection("recipes")

    # Get the current recipe
    current_recipe = await get_recipe(recipe_id)

    # Ensure user is the creator of the recipe
    if current_recipe["createdBy"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this recipe",
        )

    # Prepare update document
    update_doc = {}

    if update_data.name is not None:
        update_doc["name"] = update_data.name

    if update_data.ingredients is not None:
        update_doc["ingredients"] = update_data.ingredients

    if update_data.instructions is not None:
        update_doc["instructions"] = update_data.instructions

    if update_data.estimatedCalories is not None:
        update_doc["estimatedCalories"] = update_data.estimatedCalories

    # If no updates, return current recipe
    if not update_doc:
        return current_recipe

    # Update recipe in database
    result = recipes_collection.update_one(
        {"_id": ObjectId(recipe_id)}, {"$set": update_doc}
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Recipe update failed"
        )

    # Get updated recipe
    updated_recipe = await get_recipe(recipe_id)

    return updated_recipe


async def delete_recipe(recipe_id: str, user_id: str) -> bool:
    """
    Delete a recipe by ID

    Args:
        recipe_id: Recipe ID to delete
        user_id: ID of user making the delete request

    Returns:
        True if successful

    Raises:
        HTTPException: If recipe not found or user is not the creator
    """
    recipes_collection = get_collection("recipes")

    # Get the current recipe
    current_recipe = await get_recipe(recipe_id)

    # Ensure user is the creator of the recipe
    if current_recipe["createdBy"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this recipe",
        )

    # Delete recipe
    result = recipes_collection.delete_one({"_id": ObjectId(recipe_id)})

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Recipe deletion failed"
        )

    return True


async def get_user_recipes(
    user_id: str, skip: int = 0, limit: int = 20
) -> List[Dict[str, Any]]:
    """
    Get recipes created by a specific user

    Args:
        user_id: User ID to get recipes for
        skip: Number of recipes to skip (for pagination)
        limit: Maximum number of recipes to return

    Returns:
        List of recipe documents
    """
    recipes_collection = get_collection("recipes")

    recipes = list(
        recipes_collection.find({"createdBy": user_id})
        .sort("createdAt", -1)  # Sort by creation date, newest first
        .skip(skip)
        .limit(limit)
    )

    return recipes


async def get_saved_recipes(user_id: str) -> List[Dict[str, Any]]:
    """
    Get recipes saved by a specific user

    Args:
        user_id: User ID to get saved recipes for

    Returns:
        List of recipe documents
    """
    users_collection = get_collection("users")
    recipes_collection = get_collection("recipes")

    # Get user's saved recipe IDs
    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    saved_recipe_ids = user.get("savedRecipes", [])

    # Convert string IDs to ObjectIds
    object_ids = [ObjectId(id) for id in saved_recipe_ids]

    # Get the recipes
    if not object_ids:
        return []

    recipes = list(recipes_collection.find({"_id": {"$in": object_ids}}))

    return recipes


async def generate_recipe_from_ingredients(
    request: RecipeGenerateRequest, user_id: str
) -> Dict[str, Any]:
    """
    Generate a recipe from ingredients using AI and save it

    Args:
        request: Recipe generation request with ingredients and preferences
        user_id: ID of user making the request

    Returns:
        Generated recipe document

    Raises:
        HTTPException: If generation fails
    """
    try:
        # Generate recipe using OpenAI
        recipe_data = await generate_recipe(request.ingredients, request.preferences)

        # Create recipe model
        recipe = RecipeCreate(
            name=recipe_data["name"],
            ingredients=recipe_data["ingredients"],
            instructions=recipe_data["instructions"],
            estimatedCalories=recipe_data.get("estimatedCalories"),
        )

        # Save to database
        created_recipe = await create_recipe(recipe, user_id)

        return created_recipe

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Recipe generation failed: {str(e)}",
        )
