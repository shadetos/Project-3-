import requests
from dotenv import load_dotenv
import os
load_dotenv()
API_KEY = os.getenv("SPOONACULAR_API_KEY")


BASE_URL = "https://api.spoonacular.com/recipes"

def make_recipe():
    def get_recipes(ingredients, number=5):
        """Fetches recipes based on a list of ingredients."""
        url = f"{BASE_URL}/findByIngredients"
        params = {
            "apiKey": API_KEY,
            "ingredients": ",".join(ingredients),
            "number": number,  # Number of recipes to return
            "ranking": 1,  # 1 = maximize ingredient match, 2 = minimize missing ingredients
        }
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            return response.json()  # Returns a list of recipes
        else:
            return {"error": "Failed to fetch recipes", "status_code": response.status_code}

    ingredients_list = input("Enter a list of ingredients separated by commas: ").split(",")
    recipes = get_recipes(ingredients_list)

    for recipe in recipes:
        i = recipes.index(recipe) + 1
        print(f"{i}. {recipe['title']} - {recipe['id']}")

    def get_recipe_details(recipe_id):
        """Fetches detailed information for a given recipe ID."""
        url = f"{BASE_URL}/{recipe_id}/information"
        params = {"apiKey": API_KEY}
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": "Failed to fetch recipe details", "status_code": response.status_code}

    print("Which recipe would you like to view?")
    recipe_choice = int(input("Enter the recipe number: "))
    recipe_id = recipes[recipe_choice - 1]['id']
    recipe_details = get_recipe_details(recipe_id)

    print(f"Recipe: {recipe_details['title']}")
    print(f"Instructions: {recipe_details['instructions']}")