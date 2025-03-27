"""
Controller handling user authentication
"""

from datetime import timedelta
from typing import Dict, Any, Optional
from fastapi import HTTPException, status

from config.database import get_collection
from config.settings import JWT_EXPIRATION
from models.user import UserCreate, UserResponse, user_to_db, db_to_user
from utils.auth_utils import verify_password, get_password_hash, create_access_token
from controllers.user_controller import create_user


async def login_user(username: str, password: str) -> Dict[str, Any]:
    """
    Authenticate a user and return a JWT token

    Args:
        username: User's username or email
        password: User's password

    Returns:
        Dictionary with access token and user info

    Raises:
        HTTPException: If authentication fails
    """
    users_collection = get_collection("users")

    # Find user by username or email
    user = users_collection.find_one(
        {"$or": [{"username": username}, {"email": username}]}
    )

    # Validate user exists and password is correct
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(seconds=JWT_EXPIRATION)
    access_token = create_access_token(
        data={"sub": str(user["_id"])}, expires_delta=access_token_expires
    )

    # Return token and user info
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_to_user(user),
    }


async def register_user(user_data: UserCreate) -> Dict[str, Any]:
    """
    Register a new user and return a JWT token

    Args:
        user_data: User registration data

    Returns:
        Dictionary with access token and user info

    Raises:
        HTTPException: If registration fails
    """
    # Create the user
    created_user = await create_user(user_data)

    # Generate access token
    access_token_expires = timedelta(seconds=JWT_EXPIRATION)
    access_token = create_access_token(
        data={"sub": str(created_user["_id"])}, expires_delta=access_token_expires
    )

    # Return token and user info
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_to_user(created_user),
    }


async def refresh_token(user_id: str) -> Dict[str, str]:
    """
    Refresh a user's JWT token

    Args:
        user_id: User ID from the current token

    Returns:
        New access token

    Raises:
        HTTPException: If user not found
    """
    users_collection = get_collection("users")

    # Verify user exists
    user = users_collection.find_one({"_id": user_id})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token for user",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create new access token
    access_token_expires = timedelta(seconds=JWT_EXPIRATION)
    access_token = create_access_token(
        data={"sub": str(user["_id"])}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
