from fastapi import APIRouter
from .authController import router as auth_router
from .recipeController import router as recipe_router
from .userController import router as user_router

# Create main router
api_router = APIRouter()

# Include all routers with their prefixes
api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(recipe_router, prefix="/recipes", tags=["recipes"])
api_router.include_router(user_router, prefix="/users", tags=["users"])

# Export all controllers
__all__ = ["api_router"]
