from fastapi import APIRouter
from .auth_routes import router as auth_router
from .recipe_routes import router as recipe_router
from .user_routes import router as user_router

# Create the main router
router = APIRouter()

# Include all route modules
router.include_router(auth_router)
router.include_router(recipe_router)
router.include_router(user_router)

# Export the main router
__all__ = ["router"]
