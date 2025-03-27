"""
User routes for the Flask application
Handles user profile and saved recipes
"""

from flask import Blueprint, request, jsonify, g
from bson import ObjectId
from functools import wraps

# Initialize blueprint
user_bp = Blueprint("user", __name__)


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


@user_bp.route("/profile", methods=["GET"])
@login_required
def get_profile():
    """Get the current user's profile"""
    try:
        # Get users collection
        users_collection = get_db_collection("users")

        # Find user
        user = users_collection.find_one({"_id": ObjectId(g.user.get("id"))})

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Remove sensitive information
        user.pop("password", None)
        user.pop("password_hash", None)

        # Convert ObjectId to string for JSON serialization
        user["_id"] = str(user["_id"])

        return jsonify({"success": True, "data": user})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@user_bp.route("/profile", methods=["PUT"])
@login_required
def update_profile():
    """Update the current user's profile"""
    try:
        # Get request data
        data = request.json

        # Get users collection
        users_collection = get_db_collection("users")

        # Find user
        user = users_collection.find_one({"_id": ObjectId(g.user.get("id"))})

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Remove protected fields
        protected_fields = ["_id", "password", "password_hash", "role", "email"]
        for field in protected_fields:
            data.pop(field, None)

        # Update user
        users_collection.update_one({"_id": ObjectId(g.user.get("id"))}, {"$set": data})

        # Get updated user
        updated_user = users_collection.find_one({"_id": ObjectId(g.user.get("id"))})

        # Remove sensitive information
        updated_user.pop("password", None)
        updated_user.pop("password_hash", None)

        # Convert ObjectId to string for JSON serialization
        updated_user["_id"] = str(updated_user["_id"])

        return jsonify(
            {
                "success": True,
                "data": updated_user,
                "message": "Profile updated successfully",
            }
        )

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@user_bp.route("/saved-recipes", methods=["GET"])
@login_required
def get_saved_recipes():
    """Get the current user's saved recipes"""
    try:
        # Get users collection
        users_collection = get_db_collection("users")
        recipes_collection = get_db_collection("recipes")

        # Find user
        user = users_collection.find_one({"_id": ObjectId(g.user.get("id"))})

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Get saved recipe IDs
        saved_recipe_ids = user.get("savedRecipes", [])

        # Convert string IDs to ObjectIds
        saved_recipe_object_ids = [ObjectId(id) for id in saved_recipe_ids]

        # Find recipes
        recipes = list(
            recipes_collection.find({"_id": {"$in": saved_recipe_object_ids}})
        )

        # Convert ObjectId to string for JSON serialization
        for recipe in recipes:
            recipe["_id"] = str(recipe["_id"])

        return jsonify({"success": True, "data": recipes, "count": len(recipes)})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@user_bp.route("/saved-recipes/<recipe_id>", methods=["POST"])
@login_required
def save_recipe(recipe_id):
    """Save a recipe to the current user's saved recipes"""
    try:
        # Validate object ID
        if not ObjectId.is_valid(recipe_id):
            return jsonify({"success": False, "message": "Invalid recipe ID"}), 400

        # Get collections
        users_collection = get_db_collection("users")
        recipes_collection = get_db_collection("recipes")

        # Check if recipe exists
        recipe = recipes_collection.find_one({"_id": ObjectId(recipe_id)})

        if not recipe:
            return jsonify({"success": False, "message": "Recipe not found"}), 404

        # Update user's saved recipes (if not already saved)
        result = users_collection.update_one(
            {"_id": ObjectId(g.user.get("id")), "savedRecipes": {"$ne": recipe_id}},
            {"$push": {"savedRecipes": recipe_id}},
        )

        if result.modified_count == 0:
            # Check if it's because recipe was already saved
            user = users_collection.find_one({"_id": ObjectId(g.user.get("id"))})
            if recipe_id in user.get("savedRecipes", []):
                return jsonify({"success": True, "message": "Recipe already saved"})
            else:
                return (
                    jsonify({"success": False, "message": "Failed to save recipe"}),
                    500,
                )

        return jsonify({"success": True, "message": "Recipe saved successfully"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@user_bp.route("/saved-recipes/<recipe_id>", methods=["DELETE"])
@login_required
def unsave_recipe(recipe_id):
    """Remove a recipe from the current user's saved recipes"""
    try:
        # Get users collection
        users_collection = get_db_collection("users")

        # Update user's saved recipes
        result = users_collection.update_one(
            {"_id": ObjectId(g.user.get("id"))}, {"$pull": {"savedRecipes": recipe_id}}
        )

        if result.modified_count == 0:
            # Check if it's because recipe wasn't saved
            user = users_collection.find_one({"_id": ObjectId(g.user.get("id"))})
            if recipe_id not in user.get("savedRecipes", []):
                return jsonify(
                    {"success": True, "message": "Recipe was not in saved list"}
                )
            else:
                return (
                    jsonify(
                        {
                            "success": False,
                            "message": "Failed to remove recipe from saved list",
                        }
                    ),
                    500,
                )

        return jsonify(
            {"success": True, "message": "Recipe removed from saved list successfully"}
        )

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@user_bp.route("/calorie-log", methods=["POST"])
@login_required
def add_calorie_log():
    """Add a calorie log entry"""
    try:
        # Get request data
        data = request.json

        # Validate required fields
        required_fields = ["date", "caloriesConsumed", "caloriesBurned"]
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

        # Get users collection
        users_collection = get_db_collection("users")

        # Update user's calorie log
        result = users_collection.update_one(
            {"_id": ObjectId(g.user.get("id"))}, {"$push": {"calorieLog": data}}
        )

        if result.modified_count == 0:
            return (
                jsonify(
                    {"success": False, "message": "Failed to add calorie log entry"}
                ),
                500,
            )

        return jsonify(
            {"success": True, "message": "Calorie log entry added successfully"}
        )

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@user_bp.route("/calorie-log", methods=["GET"])
@login_required
def get_calorie_log():
    """Get the current user's calorie log"""
    try:
        # Get users collection
        users_collection = get_db_collection("users")

        # Find user
        user = users_collection.find_one({"_id": ObjectId(g.user.get("id"))})

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Get calorie log
        calorie_log = user.get("calorieLog", [])

        return jsonify(
            {"success": True, "data": calorie_log, "count": len(calorie_log)}
        )

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

/* Make a route that serves the website in production mode, render it only runs api server
