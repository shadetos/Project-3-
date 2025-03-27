"""
Recipe model for MongoDB with data validation using Pydantic
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, validator
from bson import ObjectId


# Custom ObjectId field for Pydantic validation
class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)


# Recipe models for requests and responses
class RecipeBase(BaseModel):
    name: str
    ingredients: List[str]
    instructions: str
    estimatedCalories: Optional[float] = None

    class Config:
        arbitrary_types_allowed = True


class RecipeCreate(RecipeBase):
    pass


class RecipeInDB(RecipeBase):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    createdBy: str  # User ID who created or "system" for AI-generated
    createdAt: datetime = Field(default_factory=datetime.now)

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "_id": "60d5ec9af682dbd12345678b",
                "name": "Spaghetti Carbonara",
                "ingredients": [
                    "200g spaghetti",
                    "100g pancetta",
                    "2 eggs",
                    "50g parmesan cheese",
                    "Black pepper",
                ],
                "instructions": "1. Cook pasta until al dente...",
                "estimatedCalories": 600,
                "createdBy": "60d5ec9af682dbd12345678a",
                "createdAt": "2023-01-01T12:00:00Z",
            }
        }


class RecipeResponse(RecipeBase):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    createdBy: str
    createdAt: Optional[datetime] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class RecipeUpdate(BaseModel):
    name: Optional[str] = None
    ingredients: Optional[List[str]] = None
    instructions: Optional[str] = None
    estimatedCalories: Optional[float] = None


class RecipeGenerateRequest(BaseModel):
    ingredients: List[str]
    preferences: Optional[str] = None

    @validator("ingredients", pre=True, always=True)
    @classmethod
    def validate_ingredients(cls, v):
        if not v or len(v) == 0:
            raise ValueError("At least one ingredient is required")
        return v


# Helper functions to convert between model and database representation
def recipe_to_db(recipe: RecipeCreate, user_id: str) -> Dict[str, Any]:
    """Convert RecipeCreate model to a MongoDB document"""
    return {
        "name": recipe.name,
        "ingredients": recipe.ingredients,
        "instructions": recipe.instructions,
        "estimatedCalories": recipe.estimatedCalories,
        "createdBy": user_id,
        "createdAt": datetime.now(),
    }


def db_to_recipe(recipe_data: Dict[str, Any]) -> RecipeResponse:
    """Convert MongoDB document to RecipeResponse"""
    return RecipeResponse(
        _id=str(recipe_data.get("_id")),
        name=recipe_data.get("name"),
        ingredients=recipe_data.get("ingredients", []),
        instructions=recipe_data.get("instructions"),
        estimatedCalories=recipe_data.get("estimatedCalories"),
        createdBy=recipe_data.get("createdBy"),
        createdAt=recipe_data.get("createdAt"),
    )
