"""
Authentication routes for the Flask application
Handles user registration, login, and token management
"""

from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import os

# Initialize blueprint
auth_bp = Blueprint("auth", __name__)


# Mock database function (replace with actual MongoDB connection)
def get_db_collection(collection_name):
    """Get MongoDB collection - placeholder for actual implementation"""
    return current_app.mongo.db[collection_name]


@auth_bp.route("/register", methods=["POST"])
def register():
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

        # Get users collection
        users_collection = get_db_collection("users")

        # Check if username or email already exists
        existing_user = users_collection.find_one(
            {"$or": [{"username": data["username"]}, {"email": data["email"]}]}
        )

        if existing_user:
            if existing_user.get("username") == data["username"]:
                return (
                    jsonify({"success": False, "message": "Username already exists"}),
                    400,
                )
            else:
                return (
                    jsonify({"success": False, "message": "Email already exists"}),
                    400,
                )

        # Hash password
        hashed_password = generate_password_hash(data["password"])

        # Create user document
        user = {
            "username": data["username"],
            "email": data["email"],
            "password_hash": hashed_password,
            "role": "user",  # Default role
            "savedRecipes": [],
            "calorieLog": [],
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }

        # Insert user
        result = users_collection.insert_one(user)

        # Generate JWT token
        token = generate_token(str(result.inserted_id), user["username"], user["email"])

        return (
            jsonify(
                {
                    "success": True,
                    "message": "User registered successfully",
                    "token": token,
                    "user": {
                        "id": str(result.inserted_id),
                        "username": user["username"],
                        "email": user["email"],
                        "role": user["role"],
                    },
                }
            ),
            201,
        )

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
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

        # Get users collection
        users_collection = get_db_collection("users")

        # Find user by username or email
        user = users_collection.find_one(
            {"$or": [{"username": data["username"]}, {"email": data["username"]}]}
        )

        if not user or not check_password_hash(user["password_hash"], data["password"]):
            return (
                jsonify({"success": False, "message": "Invalid username or password"}),
                401,
            )

        # Generate JWT token
        token = generate_token(str(user["_id"]), user["username"], user["email"])

        return jsonify(
            {
                "success": True,
                "message": "Login successful",
                "token": token,
                "user": {
                    "id": str(user["_id"]),
                    "username": user["username"],
                    "email": user["email"],
                    "role": user.get("role", "user"),
                },
            }
        )

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@auth_bp.route("/refresh-token", methods=["POST"])
def refresh_token():
    """Refresh a JWT token"""
    try:
        # Get the token from the Authorization header
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return (
                jsonify(
                    {"success": False, "message": "Authorization header is required"}
                ),
                401,
            )

        # Extract token
        parts = auth_header.split()

        if parts[0].lower() != "bearer":
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Authorization header must start with Bearer",
                    }
                ),
                401,
            )

        if len(parts) == 1:
            return jsonify({"success": False, "message": "Token not found"}), 401

        token = parts[1]

        # Decode the token
        try:
            jwt_secret = current_app.config["JWT_SECRET_KEY"]
            payload = jwt.decode(token, jwt_secret, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"success": False, "message": "Invalid token"}), 401

        # Get users collection
        users_collection = get_db_collection("users")

        # Find user
        user = users_collection.find_one({"_id": ObjectId(payload["id"])})

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Generate new token
        new_token = generate_token(str(user["_id"]), user["username"], user["email"])

        return jsonify(
            {
                "success": True,
                "message": "Token refreshed successfully",
                "token": new_token,
            }
        )

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Logout a user (client-side logout)"""
    # Since JWT is stateless, there's no server-side logout
    # The client should simply delete the token
    return jsonify({"success": True, "message": "Logout successful"})


def generate_token(user_id, username, email):
    """Generate a JWT token"""
    jwt_secret = current_app.config["JWT_SECRET_KEY"]

    if not jwt_secret:
        jwt_secret = os.getenv("JWT_SECRET", "default-secret-key-for-development")

    # Token payload
    payload = {
        "id": user_id,
        "username": username,
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=24),  # Token expires in 24 hours
    }

    # Generate token
    token = jwt.encode(payload, jwt_secret, algorithm="HS256")

    return token
