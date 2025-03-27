"""
Flask application factory module
"""

from flask import Flask
from routes.recipe_routes import recipe_bp
from routes.user_routes import user_bp
from routes.auth_routes import auth_bp
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize extensions
mongo = PyMongo()
jwt = JWTManager()


def create_app():
    """App factory function for creating the Flask app instance."""
    app = Flask(__name__)

    # Load configurations
    app.config["MONGO_URI"] = os.getenv("MONGODB_URI")
    if not app.config["MONGO_URI"]:
        raise ValueError("⚠️ MONGODB_URI is not set in the environment variables.")

    # JWT Configuration
    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET"
    )  # Changed key name to match flask_jwt_extended
    if not app.config["JWT_SECRET_KEY"]:
        raise ValueError(
            "⚠️ JWT_SECRET is missing. Set it in the environment variables."
        )

    # Additional JWT configurations
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600  # 1 hour
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = 2592000  # 30 days

    # Initialize extensions
    mongo.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Register blueprints (routes)
    with app.app_context():
        # Import blueprints inside app context to avoid circular imports

        app.register_blueprint(recipe_bp, url_prefix="/api/recipes")
        app.register_blueprint(user_bp, url_prefix="/api/users")
        app.register_blueprint(auth_bp, url_prefix="/api/auth")

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {"success": False, "message": "Resource not found"}, 404

    @app.errorhandler(500)
    def server_error(error):
        return {"success": False, "message": "Internal server error"}, 500

    # Health check route
    @app.route("/")
    def home():
        return {"success": True, "message": "Welcome to the Recipe Generator API"}

    return app


# Run the application when executed directly
if __name__ == "__main__":
    app = create_app()
    app.run(
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 5000)),
        debug=os.getenv("FLASK_ENV", "development") == "development",
    )
