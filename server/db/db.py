"""
MongoDB database connection and initialization for the Recipe Generator API
"""

import os
import time
import logging
from typing import Optional
from dotenv import load_dotenv
import motor.motor_asyncio
from pymongo import IndexModel, ASCENDING
from mongoengine import connect as me_connect, disconnect as me_disconnect

# Load environment variables
load_dotenv()

# Set up logger
logger = logging.getLogger(__name__)

# Get MongoDB connection string from environment variables
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "recipe_generator")

# Create MongoDB client for motor (async)
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
database = client[DB_NAME]


# Get database connection (async motor)
def get_db():
    """Get the async motor database connection"""
    return database


async def init_db(retries=5):
    """
    Initialize database with required indexes and establish connection
    with retry mechanism for better resilience.
    """
    for attempt in range(retries):
        try:
            # Create indexes for users collection
            await database.users.create_index("email", unique=True)
            await database.users.create_index("username", unique=True)

            # Create indexes for recipes collection
            await database.recipes.create_index("name")
            await database.recipes.create_index("createdBy")

            logger.info(
                f"✅ Database initialized with indexes successfully on attempt {attempt + 1}"
            )
            return True
        except Exception as e:
            logger.error(
                f"❌ Database initialization error on attempt {attempt + 1}: {str(e)}"
            )
            if attempt < retries - 1:
                wait_time = 5 * (attempt + 1)  # Exponential backoff
                logger.info(
                    f"🔄 Retrying in {wait_time} seconds... ({retries - attempt - 1} attempts left)"
                )
                await asyncio.sleep(wait_time)
            else:
                logger.error(
                    "🚨 Database initialization failed after multiple attempts."
                )
                raise


# Mongoengine connection functions (synchronous, if needed)
def connect_db(retries=5):
    """
    Establish synchronous connection to MongoDB with retry mechanism.
    Use this for synchronous code or scripts that need mongoengine.
    """
    for attempt in range(retries):
        try:
            # Connect using mongoengine
            me_connect(host=MONGODB_URI, db=DB_NAME)
            logger.info(
                f"✅ Mongoengine connected successfully on attempt {attempt + 1}"
            )
            return True
        except Exception as error:
            logger.error(
                f"❌ Mongoengine connection error on attempt {attempt + 1}: {error}"
            )
            if attempt < retries - 1:
                wait_time = 5 * (attempt + 1)  # Exponential backoff
                logger.info(
                    f"🔄 Retrying in {wait_time} seconds... ({retries - attempt - 1} attempts left)"
                )
                time.sleep(wait_time)
            else:
                logger.error(
                    "🚨 Mongoengine connection failed after multiple attempts."
                )
                return False


def close_db_connection():
    """
    Close the synchronous MongoDB connection.
    """
    try:
        me_disconnect()
        logger.info("🔻 Mongoengine connection closed.")
        return True
    except Exception as error:
        logger.error(f"❌ Error closing Mongoengine connection: {error}")
        return False


# Shutdown function for async motor
async def close_motor_connection():
    """
    Close the async motor MongoDB connection.
    """
    try:
        client.close()
        logger.info("🔻 Motor connection closed.")
        return True
    except Exception as error:
        logger.error(f"❌ Error closing Motor connection: {error}")
        return False
