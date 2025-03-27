"""
Recipe routes for the Flask application
Handles all recipe-related endpoints
"""

from flask import Blueprint, request, jsonify, g
from bson import ObjectId
import json
from functools import wraps

# Initialize blueprint
recipe_bp = Blueprint("recipe", __name__)


# Mock database function (replace with actual MongoDB connection)
def get_db_collection(collection_name):
    """Get MongoDB collection - placeholder for actual implementation"""
    from flask import current_app

    return current_app.mongo.db[collection_name]


# Authentication decorator (replace with your actual auth implementation)
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # This is just a placeholder - replace with your actual auth logic
        if not hasattr(g, "user"):
            return (
                jsonify({"success": False, "message": "Authentication required"}),
                401,
            )
        return f(*args, **kwargs)

    return decorated_function


@recipe_bp.route("/", methods=["GET"])
def get_recipes():
    """Get a list of recipes, can be filtered by query parameters"""
    try:
        # Get query parameters
        search = request.args.get("search", "")
        limit = int(request.args.get("limit", 10))
        page = int(request.args.get("page", 1))
        skip = (page - 1) * limit

        # Create query
        query = {}
        if search:
            query = {"name": {"$regex": search, "$options": "i"}}

        # Get recipes collection
        recipes_collection = get_db_collection("recipes")

        # Execute query
        recipes = list(recipes_collection.find(query).skip(skip).limit(limit))

        # Convert ObjectId to string for JSON serialization
        for recipe in recipes:
            recipe["_id"] = str(recipe["_id"])

        # Get total count for pagination
        total = recipes_collection.count_documents(query)

        return jsonify(
            {
                "success": True,
                "data": recipes,
                "total": total,
                "page": page,
                "limit": limit,
                "pages": (total + limit - 1) // limit,
            }
        )

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@recipe_bp.route("/<recipe_id>", methods=["GET"])
def get_recipe(recipe_id):
    """Get a single recipe by ID"""
    try:
        # Validate object ID
        if not ObjectId.is_valid(recipe_id):
            return jsonify({"success": False, "message": "Invalid recipe ID"}), 400

        # Get recipes collection
        recipes_collection = get_db_collection("recipes")

        # Find recipe
        recipe = recipes_collection.find_one({"_id": ObjectId(recipe_id)})

        if not recipe:
            return jsonify({"success": False, "message": "Recipe not found"}), 404

        # Convert ObjectId to string for JSON serialization
        recipe["_id"] = str(recipe["_id"])

        return jsonify({"success": True, "data": recipe})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@recipe_bp.route("/", methods=["POST"])
@login_required
def create_recipe():
    """Create a new recipe"""
    try:
        # Get request data
        data = request.json

        # Validate required fields
        required_fields = ["name", "ingredients", "instructions"]
        for field in required_fields:
            if field not in data:
                return (
                    jsonify(
                        {
                            "success": False,
                            "message": f"Missing required field: {field}",
                        }
                    ),
                    400,
                )

        # Add user ID to recipe
        data["user_id"] = g.user.get("id")

        # Get recipes collection
        recipes_collection = get_db_collection("recipes")

        # Insert recipe
        result = recipes_collection.insert_one(data)

        # Get created recipe
        created_recipe = recipes_collection.find_one({"_id": result.inserted_id})
        created_recipe["_id"] = str(created_recipe["_id"])

        return (
            jsonify(
                {
                    "success": True,
                    "data": created_recipe,
                    "message": "Recipe created successfully",
                }
            ),
            201,
        )

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@recipe_bp.route("/<recipe_id>", methods=["PUT"])
@login_required
def update_recipe(recipe_id):
    """Update an existing recipe"""
    try:
        # Validate object ID
        if not ObjectId.is_valid(recipe_id):
            return jsonify({"success": False, "message": "Invalid recipe ID"}), 400

        # Get request data
        data = request.json

        # Get recipes collection
        recipes_collection = get_db_collection("recipes")

        # Find recipe
        recipe = recipes_collection.find_one({"_id": ObjectId(recipe_id)})

        if not recipe:
            return jsonify({"success": False, "message": "Recipe not found"}), 404

        # Check if user owns the recipe
        if recipe.get("user_id") != g.user.get("id"):
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Not authorized to update this recipe",
                    }
                ),
                403,
            )

        # Update recipe
        recipes_collection.update_one({"_id": ObjectId(recipe_id)}, {"$set": data})

        # Get updated recipe
        updated_recipe = recipes_collection.find_one({"_id": ObjectId(recipe_id)})
        updated_recipe["_id"] = str(updated_recipe["_id"])

        return jsonify(
            {
                "success": True,
                "data": updated_recipe,
                "message": "Recipe updated successfully",
            }
        )

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@recipe_bp.route("/<recipe_id>", methods=["DELETE"])
@login_required
def delete_recipe(recipe_id):
    """Delete a recipe"""
    try:
        # Validate object ID
        if not ObjectId.is_valid(recipe_id):
            return jsonify({"success": False, "message": "Invalid recipe ID"}), 400

        # Get recipes collection
        recipes_collection = get_db_collection("recipes")

        # Find recipe
        recipe = recipes_collection.find_one({"_id": ObjectId(recipe_id)})

        if not recipe:
            return jsonify({"success": False, "message": "Recipe not found"}), 404

        # Check if user owns the recipe
        if recipe.get("user_id") != g.user.get("id"):
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Not authorized to delete this recipe",
                    }
                ),
                403,
            )

        # Delete recipe
        recipes_collection.delete_one({"_id": ObjectId(recipe_id)})

        return jsonify({"success": True, "message": "Recipe deleted successfully"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@recipe_bp.route("/search", methods=["GET"])
def search_recipes_by_ingredients():
    """Search for recipes by ingredients"""
    try:
        # Get query parameters
        ingredients = request.args.get("ingredients", "")
        limit = int(request.args.get("limit", 10))

        if not ingredients:
            return (
                jsonify(
                    {"success": False, "message": "Ingredients parameter is required"}
                ),
                400,
            )

        # Parse ingredients
        ingredients_list = [ing.strip() for ing in ingredients.split(",")]

        # Get recipes collection
        recipes_collection = get_db_collection("recipes")

        # Create query to find recipes containing any of the ingredients
        query = {"ingredients": {"$elemMatch": {"$in": ingredients_list}}}

        # Execute query
        recipes = list(recipes_collection.find(query).limit(limit))

        # Convert ObjectId to string for JSON serialization
        for recipe in recipes:
            recipe["_id"] = str(recipe["_id"])

        return jsonify({"success": True, "data": recipes, "count": len(recipes)})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@recipe_bp.route("/generate", methods=["POST"])
@login_required
def generate_recipe():
    """Generate a recipe based on ingredients using external API"""
    try:
        # Get request data
        data = request.json

        if "ingredients" not in data or not data["ingredients"]:
            return (
                jsonify({"success": False, "message": "Ingredients are required"}),
                400,
            )

        # This is where you would integrate with your recipe_api module
        # For now, return a mock response
        generated_recipe = {
            "name": f"Recipe with {', '.join(data['ingredients'][:3])}",
            "ingredients": data["ingredients"],
            "instructions": "This is a placeholder for generated instructions.",
            "estimatedCalories": 500,
            "user_id": g.user.get("id"),
        }

        # Get recipes collection
        recipes_collection = get_db_collection("recipes")

        # Save the generated recipe
        result = recipes_collection.insert_one(generated_recipe)

        # Get created recipe
        created_recipe = recipes_collection.find_one({"_id": result.inserted_id})
        created_recipe["_id"] = str(created_recipe["_id"])

        return (
            jsonify(
                {
                    "success": True,
                    "data": created_recipe,
                    "message": "Recipe generated successfully",
                }
            ),
            201,
        )

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
