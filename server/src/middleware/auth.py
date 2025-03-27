"""
Authentication and authorization utilities using JWT, designed for a MongoDB-based Flask application
"""

from flask import request, jsonify, g
from functools import wraps
import jwt
import os
from datetime import datetime, timedelta
from bson import ObjectId

from config.database import get_collection

# Require JWT_SECRET to be set in environment
JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    raise ValueError("Missing JWT_SECRET environment variable!")


def generate_token(user_id, username, email):
    """
    Generate a JWT token for a user

    Args:
        user_id: MongoDB ObjectId of the user
        username: User's username
        email: User's email

    Returns:
        JWT token string
    """
    return jwt.encode(
        {
            "id": str(user_id),  # Convert ObjectId to string for JWT
            "username": username,
            "email": email,
            "exp": datetime.utcnow() + timedelta(hours=24),
        },
        JWT_SECRET,
        algorithm="HS256",
    )


def authenticate_jwt(f):
    """
    Middleware decorator to authenticate JWT token

    This checks for a valid JWT token in the Authorization header
    and stores the decoded user information in Flask's g object
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return (
                jsonify(
                    {"success": False, "message": "Access denied. No token provided."}
                ),
                401,
            )

        # Extract token from header (supports "Bearer token" or just "token")
        parts = auth_header.split(" ")
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]
        else:
            token = auth_header  # Try using the entire header as token

        if not token:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Access denied. Invalid token format.",
                    }
                ),
                401,
            )

        try:
            # Decode and validate token
            decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            g.user = decoded  # Store user info in Flask's global context
        except jwt.ExpiredSignatureError:
            return (
                jsonify(
                    {"success": False, "message": "Token expired. Please log in again."}
                ),
                401,
            )
        except jwt.InvalidTokenError:
            return jsonify({"success": False, "message": "Invalid token."}), 401

        return f(*args, **kwargs)

    return decorated_function


def find_user_by_id(user_id):
    """
    Find a user by their ID in MongoDB

    Args:
        user_id: User ID (string representation of ObjectId)

    Returns:
        User document or None if not found
    """
    if not user_id:
        return None

    try:
        # Get users collection from MongoDB
        users_collection = get_collection("users")

        # Find user by ID (convert string to ObjectId)
        return users_collection.find_one({"_id": ObjectId(user_id)})
    except Exception as e:
        print(f"Error finding user: {str(e)}")
        return None


def validate_user(f):
    """
    Middleware decorator to validate that the authenticated user exists in database

    This must be used after authenticate_jwt
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get user ID from token data
        user_id = g.user.get("id")
        user = find_user_by_id(user_id)

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        g.authenticated_user = (
            user  # Store full user document in Flask's global context
        )
        return f(*args, **kwargs)

    return decorated_function


def require_admin(f):
    """
    Middleware decorator to enforce admin privileges

    This can be used after authenticate_jwt or validate_user
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get user from g.authenticated_user if it exists, otherwise find by ID
        user = g.get("authenticated_user")
        if not user:
            user_id = g.user.get("id") if hasattr(g, "user") else None
            user = find_user_by_id(user_id)

        # Check if user has admin role
        if not user or user.get("role") != "admin":
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Access denied. Admin privileges required.",
                    }
                ),
                403,
            )

        return f(*args, **kwargs)

    return decorated_function
