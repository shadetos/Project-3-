"""
Recipe Generator App - Combined Runner Script
Runs both the recipe CLI and web server without double prompting
"""

import os
import sys
import logging
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Check if this is a Flask reload (Flask sets this env var on reload)
is_flask_reload = os.environ.get("WERKZEUG_RUN_MAIN") == "true"

# Import recipe generation functionality
try:
    from api import make_recipe
except ImportError:
    try:
        from recipe_api import make_recipe
    except ImportError:

        def make_recipe():
            print(
                "Recipe API module not found. Please ensure 'api.py' or 'recipe_api.py' exists."
            )


def run_recipe_generator():
    """Run the recipe generator CLI"""
    if not is_flask_reload:  # Skip on Flask reload
        print("Starting Recipe Generator CLI...")
        make_recipe()
        print("Recipe Generator CLI completed successfully.")


def run_flask_server():
    """Run the Flask web server"""
    if not is_flask_reload:  # Only show this message on first run
        print("\nStarting Flask Web Server...")

    try:
        # Import the app here
        from app import app

        # Configure server settings
        host = os.getenv("HOST", "0.0.0.0")
        port = int(os.getenv("PORT", 5000))
        debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"

        if not is_flask_reload:  # Only log on first run
            logger.info(f"Flask server starting on {host}:{port} (debug={debug})")

        app.run(host=host, port=port, debug=debug)
        return True
    except Exception as e:
        logger.error(f"Error starting Flask server: {str(e)}")
        print(f"Flask Web Server error: {str(e)}")
        return False


if __name__ == "__main__":
    # Check if running with argument
    if len(sys.argv) > 1 and sys.argv[1] == "--web-only":
        # Run only the web server
        run_flask_server()
    elif len(sys.argv) > 1 and sys.argv[1] == "--cli-only":
        # Run only the recipe generator
        run_recipe_generator()
    else:
        # Run both
        run_recipe_generator()
        run_flask_server()
