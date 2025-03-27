"""
Database seeding script for Recipe Generator App

This script populates the MongoDB database with initial data:
- Sample users with hashed passwords (loaded from userdata.json)
- Sample recipes across different categories
- User relationships (saved recipes, etc.)

Usage:
    python seed.py             # Runs full seeding operation
    python seed.py --clear     # Clears DB before seeding
    python seed.py --users     # Only seeds users
    python seed.py --recipes   # Only seeds recipes
"""

import os
import sys
from flask import Flask
import json
import random
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash
import argparse

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config["MONGODB_URI"] = os.getenv("MONGODB_URI")
# MongoDB connection
client = MongoClient(app.config["MONGODB_URI"])
db = client.get_database("recipe_db")

# Collections
users_collection = db.users
recipes_collection = db.recipes

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Load user data from JSON file
try:
    with open(os.path.join(script_dir, "userdata.json"), "r") as f:
        USERS = json.load(f)
    print(f"Loaded {len(USERS)} users from userdata.json")
except FileNotFoundError:
    print(
        "Warning: userdata.json not found. Make sure it's in the same directory as seed.py"
    )
    USERS = []
except json.JSONDecodeError:
    print("Error: userdata.json contains invalid JSON")
    sys.exit(1)

# Sample recipe data
RECIPES = [
    {
        "name": "Classic Chocolate Chip Cookies",
        "ingredients": [
            "2 1/4 cups all-purpose flour",
            "1 teaspoon baking soda",
            "1 teaspoon salt",
            "1 cup unsalted butter, softened",
            "3/4 cup granulated sugar",
            "3/4 cup packed brown sugar",
            "2 large eggs",
            "2 teaspoons vanilla extract",
            "2 cups semi-sweet chocolate chips",
        ],
        "instructions": "1. Preheat oven to 375°F (190°C).\n2. Combine flour, baking soda, and salt in a small bowl.\n3. Beat butter, granulated sugar, and brown sugar in large mixer bowl.\n4. Add eggs one at a time, beating well after each addition. Stir in vanilla extract.\n5. Gradually beat in flour mixture. Stir in chocolate chips.\n6. Drop by rounded tablespoon onto ungreased baking sheets.\n7. Bake for 9 to 11 minutes or until golden brown.\n8. Cool on baking sheets for 2 minutes; remove to wire racks to cool completely.",
        "estimatedCalories": 150,
        "category": "Dessert",
    },
    {
        "name": "Simple Spaghetti Carbonara",
        "ingredients": [
            "8 oz spaghetti",
            "2 large eggs",
            "1/2 cup grated Parmesan cheese",
            "4 slices bacon, diced",
            "2 cloves garlic, minced",
            "Salt and black pepper to taste",
            "Fresh parsley, chopped (for garnish)",
        ],
        "instructions": "1. Cook spaghetti according to package directions; drain, reserving 1/2 cup pasta water.\n2. Meanwhile, in a small bowl, whisk eggs and Parmesan cheese until well blended; set aside.\n3. In a large skillet, cook bacon until crisp. Add garlic and cook for 30 seconds.\n4. Add hot spaghetti to skillet; toss to coat in bacon fat.\n5. Remove from heat and quickly add egg mixture, tossing constantly until eggs are barely set. Add pasta water as needed for a creamy consistency.\n6. Season with salt and pepper. Garnish with parsley before serving.",
        "estimatedCalories": 450,
        "category": "Main Dish",
    },
    {
        "name": "Fresh Berry Smoothie",
        "ingredients": [
            "1 cup mixed berries (strawberries, blueberries, raspberries)",
            "1 banana",
            "1 cup Greek yogurt",
            "1/2 cup milk",
            "1 tablespoon honey or maple syrup (optional)",
            "1/2 cup ice cubes",
        ],
        "instructions": "1. Place all ingredients in a blender.\n2. Blend until smooth.\n3. Pour into glasses and serve immediately.",
        "estimatedCalories": 250,
        "category": "Beverage",
    },
    {
        "name": "Quick Greek Salad",
        "ingredients": [
            "2 large tomatoes, diced",
            "1 cucumber, diced",
            "1 red onion, thinly sliced",
            "1 bell pepper, diced",
            "1/2 cup Kalamata olives",
            "200g feta cheese, cubed",
            "2 tablespoons extra virgin olive oil",
            "1 tablespoon red wine vinegar",
            "1 teaspoon dried oregano",
            "Salt and pepper to taste",
        ],
        "instructions": "1. In a large bowl, combine tomatoes, cucumber, red onion, bell pepper, olives, and feta cheese.\n2. In a small bowl, whisk together olive oil, red wine vinegar, oregano, salt, and pepper.\n3. Pour dressing over salad and toss gently to combine.\n4. Serve immediately or refrigerate for up to 1 hour before serving.",
        "estimatedCalories": 300,
        "category": "Salad",
    },
    {
        "name": "Homemade Guacamole",
        "ingredients": [
            "3 ripe avocados",
            "1 lime, juiced",
            "1/2 red onion, minced",
            "1 clove garlic, minced",
            "2 Roma tomatoes, diced",
            "1 jalapeño, minced (seeds removed for less heat)",
            "2 tablespoons cilantro, chopped",
            "Salt and pepper to taste",
        ],
        "instructions": "1. Cut avocados in half, remove pits, and scoop flesh into a mixing bowl.\n2. Add lime juice and mash avocados with a fork to desired consistency.\n3. Stir in onion, garlic, tomatoes, jalapeño, and cilantro.\n4. Season with salt and pepper to taste.\n5. Serve immediately or cover with plastic wrap (pressed directly onto surface of guacamole) and refrigerate for up to 2 hours.",
        "estimatedCalories": 180,
        "category": "Appetizer",
    },
    {
        "name": "Vegetable Stir Fry",
        "ingredients": [
            "2 tablespoons vegetable oil",
            "2 cloves garlic, minced",
            "1 tablespoon ginger, minced",
            "1 bell pepper, sliced",
            "1 carrot, julienned",
            "1 cup broccoli florets",
            "1 cup snap peas",
            "1/2 cup mushrooms, sliced",
            "3 tablespoons soy sauce",
            "1 tablespoon honey",
            "1 teaspoon sesame oil",
            "Sesame seeds and sliced green onions for garnish",
        ],
        "instructions": "1. Heat vegetable oil in a large wok or skillet over high heat.\n2. Add garlic and ginger, stir for 30 seconds until fragrant.\n3. Add vegetables in order of hardness (carrots first, then broccoli, bell pepper, snap peas, and mushrooms last).\n4. Stir-fry for 4-5 minutes until vegetables are crisp-tender.\n5. In a small bowl, mix soy sauce, honey, and sesame oil.\n6. Pour sauce over vegetables and toss to coat.\n7. Garnish with sesame seeds and green onions before serving.",
        "estimatedCalories": 200,
        "category": "Main Dish",
    },
    {
        "name": "Overnight Oats",
        "ingredients": [
            "1/2 cup rolled oats",
            "1/2 cup milk (dairy or plant-based)",
            "1/4 cup Greek yogurt",
            "1 tablespoon chia seeds",
            "1 tablespoon maple syrup or honey",
            "1/2 teaspoon vanilla extract",
            "Pinch of salt",
            "Toppings: fresh fruits, nuts, or nut butter",
        ],
        "instructions": "1. In a jar or container, combine oats, milk, yogurt, chia seeds, sweetener, vanilla, and salt.\n2. Stir well to combine.\n3. Cover and refrigerate overnight (at least 6 hours).\n4. In the morning, stir the oats and add a splash of milk if they're too thick.\n5. Top with fresh fruits, nuts, or nut butter before serving.",
        "estimatedCalories": 350,
        "category": "Breakfast",
    },
]


def clear_database():
    """Clear all collections in the database"""
    users_collection.delete_many({})
    recipes_collection.delete_many({})
    print("Database cleared successfully!")


def seed_users():
    """Seed users collection with sample data from userdata.json"""
    print("Seeding users...")

    # Skip if users already exist
    if users_collection.count_documents({}) > 0:
        print("Users collection already populated. Use --clear to reset.")
        return

    if not USERS:
        print("No user data found. Make sure userdata.json is properly formatted.")
        return

    # Create users with hashed passwords
    for user_data in USERS:
        # Make a copy of the user data to avoid modifying the original
        user = user_data.copy()

        # Hash password
        user["password_hash"] = generate_password_hash(user.pop("password"))

        # Add timestamps if not present
        if "created_at" not in user:
            user["created_at"] = datetime.now()
        if "updated_at" not in user:
            user["updated_at"] = datetime.now()

        # Insert user
        users_collection.insert_one(user)

    print(f"Added {len(USERS)} users to the database!")


def seed_recipes():
    """Seed recipes collection with sample data"""
    print("Seeding recipes...")

    # Skip if recipes already exist
    if recipes_collection.count_documents({}) > 0:
        print("Recipes collection already populated. Use --clear to reset.")
        return

    # Get user IDs to assign as creators
    users = list(users_collection.find({"role": "user"}))

    if not users:
        print("No users found. Seed users first!")
        return

    # Create recipes
    for recipe_data in RECIPES:
        # Assign to random user
        user = random.choice(users)

        # Add additional fields
        recipe_data["createdBy"] = str(user["_id"])
        recipe_data["createdAt"] = datetime.now() - timedelta(
            days=random.randint(1, 30)
        )

        # Insert recipe
        recipe_id = recipes_collection.insert_one(recipe_data).inserted_id

        # Randomly save recipe for some users
        if random.random() > 0.5:  # 50% chance
            random_users = random.sample(users, random.randint(1, min(3, len(users))))
            for random_user in random_users:
                users_collection.update_one(
                    {"_id": random_user["_id"]},
                    {"$push": {"savedRecipes": str(recipe_id)}},
                )

    print(f"Added {len(RECIPES)} recipes to the database!")


def create_indexes():
    """Create database indexes for optimized queries"""
    print("Creating database indexes...")

    # User indexes
    users_collection.create_index("username", unique=True)
    users_collection.create_index("email", unique=True)

    # Recipe indexes
    recipes_collection.create_index("name")
    recipes_collection.create_index("createdBy")
    recipes_collection.create_index("ingredients")

    print("Database indexes created successfully!")


def main():
    """Main function to run seeding operations"""
    parser = argparse.ArgumentParser(description="Seed the database with initial data")
    parser.add_argument(
        "--clear", action="store_true", help="Clear the database before seeding"
    )
    parser.add_argument("--users", action="store_true", help="Only seed users")
    parser.add_argument("--recipes", action="store_true", help="Only seed recipes")

    args = parser.parse_args()

    # Connect to MongoDB
    try:
        client.admin.command("ping")
        print(f"Connected to MongoDB: {app.config['MONGODB_URI']}")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        sys.exit(1)

    # Clear database if requested
    if args.clear:
        clear_database()

    # Seed based on arguments
    if args.users:
        seed_users()
    elif args.recipes:
        seed_recipes()
    else:
        # Seed everything
        seed_users()
        seed_recipes()

    # Create indexes
    create_indexes()

    print("Seeding completed successfully!")


if __name__ == "__main__":
    main()
