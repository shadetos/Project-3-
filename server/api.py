"""
Recipe API client that interacts with Spoonacular API
"""

import requests
import sys
from dotenv import load_dotenv
import os
import html
import re

# Load environment variables
load_dotenv()

# Get API key from environment
API_KEY = os.getenv("SPOONACULAR_API_KEY")
if not API_KEY:
    print("⚠️ Error: SPOONACULAR_API_KEY is not set in environment variables")
    sys.exit(1)

# API base URL
BASE_URL = "https://api.spoonacular.com/recipes"


def get_recipes_by_ingredients(ingredients, number=5):
    """
    Fetches recipes based on a list of ingredients.

    Args:
        ingredients: List of ingredients to include
        number: Number of recipes to return

    Returns:
        List of recipe dictionaries or error message
    """
    url = f"{BASE_URL}/findByIngredients"
    params = {
        "apiKey": API_KEY,
        "ingredients": ",".join(ingredients),
        "number": number,  # Number of recipes to return
        "ranking": 1,  # 1 = maximize ingredient match, 2 = minimize missing ingredients
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise exception for 4XX/5XX responses
        return response.json()
    except requests.exceptions.HTTPError as e:
        return {"error": f"HTTP error: {e}", "status_code": response.status_code}
    except requests.exceptions.ConnectionError:
        return {"error": "Connection error. Please check your internet connection."}
    except requests.exceptions.Timeout:
        return {"error": "Request timed out. Please try again."}
    except requests.exceptions.RequestException as e:
        return {"error": f"Request error: {e}"}
    except ValueError:  # Includes JSONDecodeError
        return {"error": "Failed to parse API response"}


def get_recipe_details(recipe_id):
    """
    Fetches detailed information for a given recipe ID.

    Args:
        recipe_id: ID of the recipe to retrieve

    Returns:
        Recipe details dictionary or error message
    """
    url = f"{BASE_URL}/{recipe_id}/information"
    params = {"apiKey": API_KEY, "includeNutrition": False}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        return {"error": f"HTTP error: {e}", "status_code": response.status_code}
    except requests.exceptions.ConnectionError:
        return {"error": "Connection error. Please check your internet connection."}
    except requests.exceptions.Timeout:
        return {"error": "Request timed out. Please try again."}
    except requests.exceptions.RequestException as e:
        return {"error": f"Request error: {e}"}
    except ValueError:  # Includes JSONDecodeError
        return {"error": "Failed to parse API response"}


def format_instructions(instructions):
    """
    Cleans HTML tags from instructions and formats them nicely.

    Args:
        instructions: HTML instruction text

    Returns:
        Cleaned and formatted instruction text
    """
    if not instructions:
        return "No instructions available."

    # Convert HTML entities to their character equivalents
    clean_text = html.unescape(instructions)

    # Remove HTML tags
    clean_text = re.sub(r"<.*?>", "", clean_text)

    # Ensure each step is on a new line
    clean_text = clean_text.replace(". ", ".\n")

    return clean_text


def make_recipe():
    """Main function to interact with the recipe API"""
    print("🍳 Recipe Finder 🍳")
    print("-------------------")

    # Get ingredients from user
    ingredients_input = input("\nEnter ingredients separated by commas: ").strip()
    if not ingredients_input:
        print("⚠️ No ingredients provided. Please try again.")
        return

    ingredients_list = [ing.strip() for ing in ingredients_input.split(",")]
    print(f"\nSearching for recipes with: {', '.join(ingredients_list)}...")

    # Fetch recipes
    recipes = get_recipes_by_ingredients(ingredients_list)

    # Handle errors
    if isinstance(recipes, dict) and "error" in recipes:
        print(f"❌ Error: {recipes['error']}")
        return

    # Handle no recipes found
    if not recipes:
        print(
            "❌ No recipes found with those ingredients. Please try different ingredients."
        )
        return

    # Display recipe options
    print("\nFound the following recipes:")
    for i, recipe in enumerate(recipes, 1):
        missed = recipe.get("missedIngredientCount", 0)
        print(f"{i}. {recipe['title']} (Missing ingredients: {missed})")

    # Get user choice
    while True:
        try:
            choice_input = input(
                "\nEnter recipe number to view details (or 'q' to quit): "
            )

            if choice_input.lower() == "q":
                print("Goodbye!")
                return

            recipe_choice = int(choice_input)

            if 1 <= recipe_choice <= len(recipes):
                break
            else:
                print(f"⚠️ Please enter a number between 1 and {len(recipes)}")
        except ValueError:
            print("⚠️ Please enter a valid number")

    # Get selected recipe details
    recipe_id = recipes[recipe_choice - 1]["id"]
    print(f"\nFetching details for: {recipes[recipe_choice - 1]['title']}...")
    recipe_details = get_recipe_details(recipe_id)

    # Handle errors
    if isinstance(recipe_details, dict) and "error" in recipe_details:
        print(f"❌ Error: {recipe_details['error']}")
        return

    # Display recipe details
    print("\n" + "=" * 50)
    print(f"🍽️  {recipe_details['title']}")
    print("=" * 50)

    # Display basic info
    print(f"⏱️  Ready in: {recipe_details.get('readyInMinutes', 'N/A')} minutes")
    print(f"👥 Servings: {recipe_details.get('servings', 'N/A')}")

    # Display ingredients
    print("\n📋 Ingredients:")
    for ingredient in recipe_details.get("extendedIngredients", []):
        print(f"  • {ingredient.get('original', 'N/A')}")

    # Display instructions
    print("\n📝 Instructions:")
    instructions = format_instructions(recipe_details.get("instructions", ""))
    print(instructions)

    # Display source
    if recipe_details.get("sourceUrl"):
        print(f"\n🔗 Source: {recipe_details['sourceUrl']}")

    print("\nEnjoy your meal! 🍴")


if __name__ == "__main__":
    try:
        make_recipe()
    except KeyboardInterrupt:
        print("\nProgram terminated by user.")
        sys.exit(0)
