from __init__ import create_app
from flask import request, jsonify
import requests
import os

app = create_app()

API_KEY = os.getenv("SPOONACULAR_API_KEY") 

@app.route('/search', methods=['GET'])
def search_recipes():
    ingredient = request.args.get('ingredient')
    url = f"https://api.spoonacular.com/recipes/findByIngredients?ingredients={ingredient}&number=5&apiKey={API_KEY}"
    
    response = requests.get(url)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch recipes"}), response.status_code


if __name__ == '__main__':
    app.run(debug=True)
