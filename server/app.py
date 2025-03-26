"""
Simplified Flask application for Recipe Generator
All routes defined in a single file for simplicity
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)

# Configure app
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "default-secret-key")

# Enable CORS
CORS(app)


# Health check route
@app.route("/")
def home():
    return {"success": True, "message": "Welcome to the Recipe Generator API"}


# Recipe routes
@app.route("/api/recipes", methods=["GET"])
def get_recipes():
    """Get a list of recipes"""
    try:
        # In a real app, you would fetch from a database
        # Mock data for now
        recipes = [
            {
                "id": "1",
                "name": "Chocolate Cake",
                "ingredients": [
                    "flour",
                    "sugar",
                    "cocoa powder",
                    "baking powder",
                    "milk",
                    "eggs",
                    "vanilla",
                ],
                "instructions": "Mix dry ingredients. Add wet ingredients. Bake at 350°F for 30 minutes.",
            },
            {
                "id": "2",
                "name": "Pancakes",
                "ingredients": [
                    "flour",
                    "sugar",
                    "baking powder",
                    "salt",
                    "milk",
                    "eggs",
                    "butter",
                ],
                "instructions": "Mix ingredients. Cook on griddle until bubbles form, then flip.",
            },
        ]

        return jsonify({"success": True, "data": recipes, "count": len(recipes)})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/api/recipes/search", methods=["GET"])
def search_recipes():
    """Search for recipes by ingredients"""
    try:
        # Get query parameters
        ingredients = request.args.get("ingredients", "")

        if not ingredients:
            return (
                jsonify(
                    {"success": False, "message": "Ingredients parameter is required"}
                ),
                400,
            )

        # Parse ingredients
        ingredients_list = [ing.strip() for ing in ingredients.split(",")]

        # Mock response (in a real app, you would search your database)
        sample_recipes = [
            {
                "id": "1",
                "name": f"Recipe with {ingredients_list[0]}",
                "ingredients": ingredients_list,
                "instructions": "Sample instructions",
                "estimatedCalories": 500,
            },
            {
                "id": "2",
                "name": f"Another {ingredients_list[0]} Recipe",
                "ingredients": ingredients_list,
                "instructions": "More sample instructions",
                "estimatedCalories": 700,
            },
        ]

        return jsonify(
            {"success": True, "data": sample_recipes, "count": len(sample_recipes)}
        )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# User routes
@app.route("/api/users/register", methods=["POST"])
def register_user():
    """Register a new user"""
    try:
        # Get request data
        data = request.json

        # Validate required fields
        required_fields = ["username", "email", "password"]
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

        # Mock successful registration
        return (
            jsonify(
                {
                    "success": True,
                    "message": "User registered successfully",
                    "user": {
                        "id": "user123",
                        "username": data["username"],
                        "email": data["email"],
                    },
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/api/users/login", methods=["POST"])
def login_user():
    """Login a user"""
    try:
        # Get request data
        data = request.json

        # Validate required fields
        required_fields = ["username", "password"]
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

        # Mock successful login
        return jsonify(
            {
                "success": True,
                "message": "Login successful",
                "token": "mock-jwt-token",
                "user": {
                    "id": "user123",
                    "username": data["username"],
                    "email": "user@example.com",
                },
            }
        )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# Run the application
if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("ENVIRONMENT", "development") == "development"

    logger.info(f"Starting Flask server on {host}:{port} (debug={debug})")
    app.run(host=host, port=port, debug=debug)
