"""
Recipe Generator App - Combined Runner Script
Runs both the recipe CLI and FastAPI web server with flexible options
"""

import os
import sys
import logging
import asyncio
import subprocess
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Check if this is a development reload
is_reload = (
    os.environ.get("WERKZEUG_RUN_MAIN") == "true"
    or os.environ.get("UVICORN_RELOAD") == "true"
)

# Import recipe generation functionality
try:
    from api import make_recipe
except ImportError:
    try:
        from recipe_api import make_recipe
    except ImportError:
        try:
            from server.api import make_recipe
        except ImportError:

            def make_recipe():
                logger.error(
                    "Recipe API module not found. Please ensure 'api.py' or 'recipe_api.py' exists."
                )
                return False


def run_recipe_generator():
    """Run the recipe generator CLI"""
    if not is_reload:  # Skip on reloads
        logger.info("Starting Recipe Generator CLI...")
        try:
            make_recipe()
            logger.info("Recipe Generator CLI completed successfully.")
            return True
        except Exception as e:
            logger.error(f"Recipe Generator CLI error: {str(e)}")
            return False


def run_fastapi_server():
    """Run the FastAPI web server using uvicorn"""
    if not is_reload:  # Only show this message on first run
        logger.info("\nStarting FastAPI Web Server...")

    try:
        # Configure server settings
        host = os.getenv("HOST", "0.0.0.0")
        port = int(os.getenv("PORT", 8000))
        reload = os.getenv("API_DEBUG", "true").lower() == "true"

        if not is_reload:  # Only log on first run
            logger.info(f"FastAPI server starting on {host}:{port} (reload={reload})")

        # Use subprocess to run uvicorn
        cmd = ["uvicorn", "main:app", f"--host={host}", f"--port={port}"]

        if reload:
            cmd.append("--reload")

        process = subprocess.Popen(cmd)
        return process

    except Exception as e:
        logger.error(f"Error starting FastAPI server: {str(e)}")
        return None


def run_flask_server():
    """Run the Flask web server (legacy support)"""
    if not is_reload:  # Only show this message on first run
        logger.info("\nStarting Flask Web Server...")

    try:
        # Import the app here to avoid circular imports
        try:
            from app import app
        except ImportError:
            try:
                from server.app import app
            except ImportError:
                logger.error("Flask app not found. Please ensure 'app.py' exists.")
                return None

        # Configure server settings
        host = os.getenv("HOST", "0.0.0.0")
        port = int(os.getenv("PORT", 5000))
        debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"

        if not is_reload:  # Only log on first run
            logger.info(f"Flask server starting on {host}:{port} (debug={debug})")

        # Use subprocess to run Flask
        os.environ["FLASK_APP"] = "server.app:app"
        cmd = ["flask", "run", f"--host={host}", f"--port={port}"]

        if debug:
            os.environ["FLASK_DEBUG"] = "1"

        process = subprocess.Popen(cmd)
        return process

    except Exception as e:
        logger.error(f"Error starting Flask server: {str(e)}")
        return None


def detect_server_type():
    """Detect whether to run FastAPI or Flask based on available modules"""
    try:
        import fastapi

        logger.info("FastAPI detected")
        return "fastapi"
    except ImportError:
        try:
            import flask

            logger.info("Flask detected")
            return "flask"
        except ImportError:
            logger.warning("Neither FastAPI nor Flask detected. Defaulting to FastAPI.")
            return "fastapi"


def main():
    """Main entry point with command line argument processing"""
    # Parse arguments
    args = sys.argv[1:] if len(sys.argv) > 1 else []

    run_cli = "--web-only" not in args
    run_web = "--cli-only" not in args

    # Determine server type
    server_type = "fastapi"  # Default to FastAPI
    if "--flask" in args:
        server_type = "flask"
    elif "--fastapi" in args:
        server_type = "fastapi"
    else:
        server_type = detect_server_type()

    # Run CLI if requested
    if run_cli:
        cli_success = run_recipe_generator()
        if not cli_success and not run_web:
            logger.error("Recipe CLI failed and no web server was requested. Exiting.")
            return 1

    # Run web server if requested
    if run_web:
        if server_type == "fastapi":
            server_process = run_fastapi_server()
        else:
            server_process = run_flask_server()

        if server_process:
            try:
                # Keep the script running while the subprocess is active
                server_process.wait()
                return 0
            except KeyboardInterrupt:
                logger.info("Shutting down server...")
                server_process.terminate()
                return 0
        else:
            logger.error("Failed to start web server.")
            return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
