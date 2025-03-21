from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

mongo = PyMongo()
jwt = JWTManager()


def create_app():
    """App factory function for creating the Flask app instance."""
    app = Flask(__name__)

    # Load configurations
    app.config["MONGO_URI"] = os.getenv("MONGODB_URI")
    if not app.config["MONGO_URI"]:
        raise ValueError("⚠️ MONGODB_URI is not set in the environment variables.")

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")
    if not app.config["JWT_SECRET_KEY"]:
        raise ValueError(
            "⚠️ JWT_SECRET is missing. Set it in the environment variables."
        )

    # Initialize extensions
    mongo.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Register blueprints (routes)
    from server.routes.recipe_routes import recipe_bp
    from server.routes.user_routes import user_bp

    app.register_blueprint(recipe_bp, url_prefix="/api/recipes")
    app.register_blueprint(user_bp, url_prefix="/api/users")

    # Health check route
    @app.route("/")
    def home():
        return {"message": "Welcome to the Recipe Generator API"}

    return app
