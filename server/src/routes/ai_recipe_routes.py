"""
Routes for AI recipe generation
"""

from flask import Blueprint, request, jsonify, g
from services.ai_recipe_service import generate_recipe

# Initialize blueprint
ai_recipe_bp = Blueprint("ai_recipe", __name__)


@ai_recipe_bp.route("/generate-ai", methods=["POST"])
def generate_ai_recipe():
    """Generate a recipe using OpenAI based on ingredients"""
    try:
        # Get request data
        data = request.json

        # Validate request
        if not data or "ingredients" not in data:
            return (
                jsonify({"success": False, "message": "Ingredients are required"}),
                400,
            )

        # Extract ingredients and preferences
        ingredients = data.get("ingredients", [])
        preferences = data.get("preferences")

        # Generate the recipe using AI
        recipe = await generate_recipe(ingredients, preferences)

        # Add user ID if user is authenticated
        if hasattr(g, "user"):
            recipe["user_id"] = g.user.get("id")

        return jsonify({"success": True, "data": recipe}), 200

    except ValueError as e:
        # Handle validation errors
        return jsonify({"success": False, "message": str(e)}), 400
    except Exception as e:
        # Handle other errors
        print(f"Error in generate_ai_recipe: {str(e)}")
        return (
            jsonify(
                {
                    "success": False,
                    "message": "An error occurred while generating the recipe",
                }
            ),
            500,
        )
