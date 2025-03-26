"""
Controller handling user-related operations
"""

from typing import Dict, Any, List, Optional
from bson import ObjectId
from fastapi import HTTPException, status

from config.database import get_collection
from models.user import (
    UserCreate,
    UserUpdate,
    UserResponse,
    user_to_db,
    db_to_user,
    CalorieLogEntry,
)
from utils.auth_utils import get_password_hash


async def create_user(user: UserCreate) -> Dict[str, Any]:
    """
    Create a new user in the database

    Args:
        user: User data from request

    Returns:
        Created user document

    Raises:
        HTTPException: If username or email already exists
    """
    users_collection = get_collection("users")

    # Check if username or email already exists
    existing_user = users_collection.find_one(
        {"$or": [{"username": user.username}, {"email": user.email}]}
    )

    if existing_user:
        if existing_user["username"] == user.username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered",
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

    # Hash the password
    hashed_password = get_password_hash(user.password)

    # Convert to database model
    user_db = user_to_db(user, hashed_password)

    # Insert into database
    result = users_collection.insert_one(user_db)

    # Get the created user
    created_user = users_collection.find_one({"_id": result.inserted_id})

    return created_user


async def get_user(user_id: str) -> Dict[str, Any]:
    """
    Get a user by ID

    Args:
        user_id: User ID to retrieve

    Returns:
        User document

    Raises:
        HTTPException: If user not found
    """
    users_collection = get_collection("users")

    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID format"
        )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return user


async def update_user(user_id: str, update_data: UserUpdate) -> Dict[str, Any]:
    """
    Update a user's information

    Args:
        user_id: User ID to update
        update_data: New user data

    Returns:
        Updated user document

    Raises:
        HTTPException: If user not found or username/email already exists
    """
    users_collection = get_collection("users")

    # Get the current user
    current_user = await get_user(user_id)

    # Prepare update document
    update_doc = {}

    # Handle username update
    if update_data.username and update_data.username != current_user["username"]:
        # Check if username is already taken
        existing_user = users_collection.find_one({"username": update_data.username})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken"
            )
        update_doc["username"] = update_data.username

    # Handle email update
    if update_data.email and update_data.email != current_user["email"]:
        # Check if email is already taken
        existing_user = users_collection.find_one({"email": update_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        update_doc["email"] = update_data.email

    # Handle password update
    if update_data.password:
        update_doc["password_hash"] = get_password_hash(update_data.password)

    # If no updates, return current user
    if not update_doc:
        return current_user

    # Update user in database
    result = users_collection.update_one(
        {"_id": ObjectId(user_id)}, {"$set": update_doc}
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User update failed"
        )

    # Get updated user
    updated_user = await get_user(user_id)

    return updated_user


async def delete_user(user_id: str) -> bool:
    """
    Delete a user by ID

    Args:
        user_id: User ID to delete

    Returns:
        True if successful

    Raises:
        HTTPException: If user not found or deletion fails
    """
    users_collection = get_collection("users")

    # Validate user exists
    await get_user(user_id)

    # Delete user
    result = users_collection.delete_one({"_id": ObjectId(user_id)})

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User deletion failed"
        )

    return True


async def add_recipe_to_saved(user_id: str, recipe_id: str) -> Dict[str, Any]:
    """
    Add a recipe to a user's saved recipes

    Args:
        user_id: User ID
        recipe_id: Recipe ID to save

    Returns:
        Updated user document

    Raises:
        HTTPException: If user or recipe not found
    """
    users_collection = get_collection("users")
    recipes_collection = get_collection("recipes")

    # Validate user exists
    user = await get_user(user_id)

    # Validate recipe exists
    try:
        recipe = recipes_collection.find_one({"_id": ObjectId(recipe_id)})
        if recipe is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
            )
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid recipe ID format"
        )

    # Add recipe ID to saved recipes if not already saved
    if recipe_id not in user.get("savedRecipes", []):
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)}, {"$push": {"savedRecipes": recipe_id}}
        )

        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to save recipe"
            )

    # Get updated user
    updated_user = await get_user(user_id)

    return updated_user


async def remove_recipe_from_saved(user_id: str, recipe_id: str) -> Dict[str, Any]:
    """
    Remove a recipe from a user's saved recipes

    Args:
        user_id: User ID
        recipe_id: Recipe ID to remove

    Returns:
        Updated user document

    Raises:
        HTTPException: If user not found or operation fails
    """
    users_collection = get_collection("users")

    # Validate user exists
    user = await get_user(user_id)

    # Remove recipe ID from saved recipes
    result = users_collection.update_one(
        {"_id": ObjectId(user_id)}, {"$pull": {"savedRecipes": recipe_id}}
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recipe not in saved list or removal failed",
        )

    # Get updated user
    updated_user = await get_user(user_id)

    return updated_user


async def add_calorie_log(user_id: str, log_entry: CalorieLogEntry) -> Dict[str, Any]:
    """
    Add a calorie log entry to a user's records

    Args:
        user_id: User ID
        log_entry: Calorie log entry to add

    Returns:
        Updated user document

    Raises:
        HTTPException: If user not found or operation fails
    """
    users_collection = get_collection("users")

    # Validate user exists
    await get_user(user_id)

    # Add log entry
    entry_dict = log_entry.dict()

    result = users_collection.update_one(
        {"_id": ObjectId(user_id)}, {"$push": {"calorieLog": entry_dict}}
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to add calorie log"
        )

    # Get updated user
    updated_user = await get_user(user_id)

    return updated_user
