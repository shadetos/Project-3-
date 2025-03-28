"""
User model for MongoDB with data validation using Pydantic
"""

from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, validator, root_validator
from bson import ObjectId


# Custom ObjectId field for Pydantic validation
class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, str) and not isinstance(v, ObjectId):
            raise ValueError("Invalid ObjectId")

        if isinstance(v, str):
            if not ObjectId.is_valid(v):
                raise ValueError("Invalid ObjectId format")
            return str(v)

        return str(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


# User models for requests and responses
class UserBase(BaseModel):
    username: str
    email: EmailStr

    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True


class UserCreate(UserBase):
    password: str

    @validator("password")
    def password_strength(self, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        # Add more validation as needed (uppercase, lowercase, numbers, special chars)
        return v

    @validator("username")
    @classmethod
    def username_valid(cls, v):
        """Validate the username for minimum length and alphanumeric characters."""
        if len(v) < 3:
            raise ValueError("Username must be at least 3 characters")
        if not v.isalnum():
            raise ValueError("Username must contain only alphanumeric characters")
        return v


class TokenData(BaseModel):
    email: Optional[str] = None
    exp: Optional[datetime] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CalorieLogEntry(BaseModel):
    date: datetime = Field(default_factory=datetime.now)
    caloriesConsumed: float = 0
    caloriesBurned: float = 0


class RecipeSummary(BaseModel):
    id: PyObjectId = Field(alias="_id")
    name: str
    estimatedCalories: Optional[float] = None
    createdAt: datetime

    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True
        json_encoders = {ObjectId: str}


class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    password_hash: str
    savedRecipes: List[str] = []
    calorieLog: List[CalorieLogEntry] = []
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True
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


class UserResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    username: str
    email: EmailStr
    savedRecipes: List[str] = []
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True
        json_encoders = {ObjectId: str}


class UserAuthResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    access_token: str
    token_type: str = "bearer"


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

    @root_validator
    @classmethod
    def check_at_least_one_field(cls, values):
        # Ensure at least one field is being updated
        if not any(values.values()):
            raise ValueError("At least one field must be provided for update")
        return values

    @validator("username")
    def username_valid(self, v):
        if v is None:
            return v
        if len(v) < 3:
            raise ValueError("Username must be at least 3 characters")
        if not v.isalnum():
            raise ValueError("Username must contain only alphanumeric characters")
        return v

    @validator("password")
    def password_valid(self, v):
        if v is None:
            return v
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


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
        updated_at=user_data.get("updated_at"),
    )


def db_to_auth_response(
    user_data: Dict[str, Any], access_token: str
) -> UserAuthResponse:
    """Convert MongoDB document to UserAuthResponse with token"""
    return UserAuthResponse(
        id=str(user_data.get("_id")),
        username=user_data.get("username"),
        email=user_data.get("email"),
        access_token=access_token,
    )
