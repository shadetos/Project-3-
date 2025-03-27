"""
Database configuration and utilities for MongoDB
"""

from flask import current_app
import logging

logger = logging.getLogger(__name__)


def get_collection(collection_name):
    """
    Get a MongoDB collection

    Args:
        collection_name: Name of the collection

    Returns:
        MongoDB collection
    """
    return current_app.mongo.db[collection_name]


def init_db():
    """
    Initialize database connections and create indexes
    """
    try:
        # Create indexes
        create_indexes()
        logger.info("Database indexes created successfully")
        return True
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        return False


def create_indexes():
    """
    Create database indexes for optimized queries
    """
    # Get collections
    users = get_collection("users")
    recipes = get_collection("recipes")

    # Create indexes for users collection
    users.create_index("username", unique=True)
    users.create_index("email", unique=True)

    # Create indexes for recipes collection
    recipes.create_index("name")
    recipes.create_index("user_id")
    recipes.create_index("ingredients")
    recipes.create_index("estimatedCalories")
    recipes.create_index("created_at")
    recipes.create_index("updated_at")
