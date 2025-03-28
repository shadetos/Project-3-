"""
Authentication routes for the Recipe Generator API
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from typing import Annotated, Dict, Any
from datetime import timedelta, datetime
import logging

# Set up logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router - CHANGED: removed the prefix since it will be added in main.py
router = APIRouter(tags=["authentication"])

# Temporary authentication for development
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Temporary in-memory user store for testing
test_users = {
    "user@example.com": {
        "_id": "temp-user-id",
        "username": "testuser",
        "email": "user@example.com",
        "password": "password123",
    }
}


# Helper functions until your real utils are working
def create_access_token(data: Dict[str, Any], expires_delta: timedelta = None) -> str:
    """Simple token generator for development"""
    return "temp-access-token"


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Simple user lookup for development"""
    # In a real app, you would decode the token
    return {"_id": "temp-user-id", "username": "testuser", "email": "user@example.com"}


@router.post("/api/auth/register")
async def register_user(request: Request):
    """
    Register a new user and return access token
    """
    try:
        # Get JSON body
        user_data = await request.json()
        logger.info(f"Registration data received: {user_data}")

        # Extract user info
        username = user_data.get("username")
        email = user_data.get("email")
        password = user_data.get("password")

        # Simple validation
        if not all([username, email, password]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing required fields",
            )

        # Check if user exists (simple in-memory check)
        if email in test_users:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists",
            )

        # Store user (in memory for now)
        test_users[email] = {
            "_id": f"user-{len(test_users) + 1}",
            "username": username,
            "email": email,
            "password": password,  # In a real app, this would be hashed
        }

        # Return response in the format expected by the frontend
        return {
            "id": test_users[email]["_id"],
            "username": username,
            "email": email,
            "access_token": "temp-access-token",
            "token_type": "bearer",
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed. Please try again later.",
        )


@router.post("/api/auth/login")
async def login(request: Request):
    """
    Authenticate a user and return access token
    """
    try:
        # Get JSON body
        login_data = await request.json()
        logger.info(f"Login data received: {login_data}")

        email = login_data.get("email")
        password = login_data.get("password")

        # Simple validation
        if not email or not password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email and password are required",
            )

        # Check if user exists and password matches
        # (Using simple in-memory check for development)
        user = test_users.get(email)
        if not user or user["password"] != password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        # Return response in the format expected by the frontend
        return {
            "access_token": "temp-access-token",
            "token_type": "bearer",
            "user": {
                "id": user["_id"],
                "username": user["username"],
                "email": user["email"],
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again later.",
        )


@router.get("/api/auth/me")
async def get_user_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get current user profile
    """
    # Return user info for the authenticated user
    return {
        "id": current_user["_id"],
        "username": current_user["username"],
        "email": current_user["email"],
    }


@router.get("/api/auth/health-check")
async def health_check():
    """
    Health check endpoint for the auth service
    """
    return {"status": "ok", "message": "Auth service is running"}
