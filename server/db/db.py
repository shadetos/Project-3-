from mongoengine import connect, disconnect
import os
import time


def connect_db(retries=5):
    """Establish connection to MongoDB with retry mechanism."""
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/recipeApp")

    for attempt in range(retries):
        try:
            # Connect using mongoengine
            connect(host=mongo_uri)
            print(f"✅ MongoDB connected successfully on attempt {attempt + 1}")
            return True
        except Exception as error:
            print(f"❌ MongoDB connection error on attempt {attempt + 1}: {error}")
            if attempt < retries - 1:
                wait_time = 5 * (attempt + 1)  # Exponential backoff
                print(
                    f"🔄 Retrying in {wait_time} seconds... ({retries - attempt - 1} attempts left)"
                )
                time.sleep(wait_time)
            else:
                print("🚨 MongoDB connection failed after multiple attempts.")
                return False


def close_db_connection():
    """Close the MongoDB connection."""
    try:
        disconnect()
        print("🔻 MongoDB connection closed.")
        return True
    except Exception as error:
        print(f"❌ Error closing MongoDB connection: {error}")
        return False
