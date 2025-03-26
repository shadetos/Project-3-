"""
User model for MongoDB with data validation using Pydantic
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, validator
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


# User models for requests and responses
class UserBase(BaseModel):
    username: str
    email: EmailStr

    class Config:
        arbitrary_types_allowed = True


class UserCreate(UserBase):
    password: str

    @validator("password")
    def password_strength(self, cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class CalorieLogEntry(BaseModel):
    date: datetime = Field(default_factory=datetime.now)
    caloriesConsumed: float = 0
    caloriesBurned: float = 0


class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    password_hash: str
    savedRecipes: List[str] = []
    calorieLog: List[CalorieLogEntry] = []
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "_id": "60d5ec9af682dbd12345678a",
                "username": "johnsmith",
                "email": "john.smith@example.com",
                "password_hash": "[hashed_password]",
                "savedRecipes": ["60d5ec9af682dbd12345678b"],
                "calorieLog": [
                    {
                        "date": "2023-01-01T12:00:00Z",
                        "caloriesConsumed": 1800,
                        "caloriesBurned": 400,
                    }
                ],
                "created_at": "2023-01-01T12:00:00Z",
                "updated_at": "2023-01-01T12:00:00Z",
            }
        }


class UserResponse(UserBase):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    savedRecipes: List[str] = []
    created_at: Optional[datetime] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


# Helper functions to convert between model and database representation
def user_to_db(user: UserCreate, password_hash: str) -> Dict[str, Any]:
    """Convert UserCreate model to a MongoDB document"""
    return {
        "username": user.username,
        "email": user.email,
        "password_hash": password_hash,
        "savedRecipes": [],
        "calorieLog": [],
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
    }


def db_to_user(user_data: Dict[str, Any]) -> UserResponse:
    """Convert MongoDB document to UserResponse"""
    return UserResponse(
        _id=str(user_data.get("_id")),
        username=user_data.get("username"),
        email=user_data.get("email"),
        savedRecipes=user_data.get("savedRecipes", []),
        created_at=user_data.get("created_at"),
    )
