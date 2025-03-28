from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Recipe Generator API",
    description="API for the Recipe Generator app",
    version="1.0.0",
)

# Configure CORS
origins = [
    "http://localhost:3000",  # React development server
    "http://localhost:5173",  # Vite development server
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    os.getenv("FRONTEND_URL", ""),  # Production frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """
    Root endpoint
    """
    return {"message": "Welcome to the Recipe Generator API"}


@app.get("/api/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "ok", "message": "API is running"}


@app.post("/api/auth/register")
async def register_user(user_data: dict):
    """
    Temporary register endpoint that always returns success
    """
    logger.info(f"Registration data received: {user_data}")
    return {
        "id": "temp-user-id",
        "username": user_data.get("username"),
        "email": user_data.get("email"),
        "access_token": "temp-access-token",
        "token_type": "bearer",
    }


@app.post("/api/auth/login")
async def login(form_data: dict):
    """
    Simplified login endpoint that always succeeds
    """
    # Log the received data for debugging
    logger.info(f"Login attempt received with: {form_data}")

    # Extract email from the request data or use a default
    email = form_data.get("email", "user@example.com")

    # Generate username from email
    username = email.split("@")[0] if "@" in email else "user"

    # Always return a successful response
    return {
        "access_token": "dummy-token-that-always-works",
        "token_type": "bearer",
        "user": {
            "id": "dummy-user-id",
            "username": username,
            "email": email,
        },
    }


@app.get("/api/auth/me")
async def get_current_user():
    """
    Endpoint to get the current user profile
    """
    # In a real implementation, you would extract the token from
    # the Authorization header and validate it

    return {
        "id": "temp-user-id",
        "username": "tempuser",
        "email": "temp@example.com",
    }


# For running the app with uvicorn directly
if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
