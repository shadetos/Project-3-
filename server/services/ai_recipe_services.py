"""
Service for generating recipes using OpenAI's API
"""

import json
import os
import time
import openai
from typing import List, Dict, Any, Optional

# Get API key from environment variable
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Set up OpenAI API
openai.api_key = OPENAI_API_KEY


async def generate_recipe(
    ingredients: List[str], preferences: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generate a recipe based on the provided ingredients using OpenAI's API

    Args:
        ingredients: List of ingredients to use in the recipe
        preferences: Optional dietary preferences or requirements

    Returns:
        Dictionary containing the generated recipe details
    """
    # Construct the prompt
    prompt = "Generate a recipe using these ingredients: " + ", ".join(ingredients)

    if preferences:
        prompt += f"\nDietary preferences/requirements: {preferences}"

    prompt += '\nFormat the response as a JSON object with the following structure: {"name": "Recipe Name", "ingredients": ["ingredient 1", "ingredient 2", ...], "instructions": "Step-by-step instructions", "estimatedCalories": approximate_calories_as_number, "estimatedTime": cooking_time_in_minutes, "servings": number_of_servings}'

    try:
        # Call OpenAI API
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional chef providing detailed, accurate recipes.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=1000,
        )

        # Extract and parse the response
        recipe_json_str = response.choices[0].message.content.strip()

        # Extract the JSON part (in case there's extra text)
        try:
            # Try to parse the entire response
            recipe_data = json.loads(recipe_json_str)
        except json.JSONDecodeError:
            # If that fails, try to extract the JSON part using brackets
            start_idx = recipe_json_str.find("{")
            end_idx = recipe_json_str.rfind("}") + 1

            if start_idx >= 0 and end_idx > start_idx:
                json_part = recipe_json_str[start_idx:end_idx]
                recipe_data = json.loads(json_part)
            else:
                raise ValueError("Failed to extract JSON from the response")

        # Validate required fields
        if not all(
            key in recipe_data for key in ["name", "ingredients", "instructions"]
        ):
            raise ValueError("Generated recipe is missing required fields")

        # Create a recipe object with the expected format
        recipe = {
            "_id": f"ai-{int(time.time())}",
            "name": recipe_data["name"],
            "ingredients": recipe_data["ingredients"],
            "instructions": recipe_data["instructions"],
            "estimatedCalories": recipe_data.get(
                "estimatedCalories",
                await estimate_calories(
                    recipe_data["name"], recipe_data["ingredients"]
                ),
            ),
            "estimatedTime": f"{recipe_data.get('estimatedTime', 30)} mins",
            "servings": recipe_data.get("servings", 4),
            "image": f"https://source.unsplash.com/random/800x600/?{recipe_data['name'].replace(' ', '+')}",
            "ai_generated": True,
            "diets": [preferences] if preferences else [],
        }

        return recipe

    except Exception as e:
        # Log the error
        print(f"Error generating recipe: {str(e)}")
        raise ValueError(f"Failed to generate recipe: {str(e)}")


async def estimate_calories(recipe_name: str, ingredients: List[str]) -> float:
    """
    Estimate calories for a recipe using OpenAI (simplified version)

    In a production app, you would use a nutrition API like Nutritionix
    but this simplified version uses AI to estimate

    Args:
        recipe_name: Name of the recipe
        ingredients: List of ingredients with amounts

    Returns:
        Estimated calories as a float
    """
    prompt = f"Estimate the total calories in this recipe called '{recipe_name}' with these ingredients: {', '.join(ingredients)}. Return only a number representing the total calories."

    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a nutrition expert providing accurate calorie estimations.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=50,
        )

        # Extract the estimated calories
        calories_text = response.choices[0].message.content.strip()

        # Try to extract just the number
        import re

        calories_match = re.search(r"\d+", calories_text)

        if calories_match:
            calories = float(calories_match.group())
            return calories
        else:
            # Default to 0 if extraction fails
            return 0

    except Exception as e:
        print(f"Error estimating calories: {str(e)}")
        return 0  # Default to 0 on error
