# Recipe Generator App

A full-stack web application that suggests recipes using AI and allows users to save and bookmark recipes. Built with a Python back end (MongoDB, Render deployment) and a React-based front end that integrates user authentication and optional external APIs for enhanced functionality.

---

## Table of Contents

1. [Project Description](#project-description)
2. [MVP Features](#mvp-features)
3. [Beyond MVP Features](#beyond-mvp-features)
4. [Technologies Used](#technologies-used)
5. [Architecture](#architecture)
6. [Database Schema](#database-schema)
7. [Setup and Installation](#setup-and-installation)
8. [Usage](#usage)
9. [Future Enhancements](#future-enhancements)
10. [License](#license)

---

## Project Description

The Recipe Generator App is designed for anyone who wants quick inspiration for what to cook with the ingredients they have on hand. Users can log into the application, enter the ingredients they have, and receive AI-generated recipe suggestions. Each user can also save favorite recipes, track their caloric intake, and optionally schedule meals or exercise in a personal dashboard.

---

## MVP Features

### JWT Authentication

- Users can sign up and log in securely.
- JWT tokens protect access to authenticated routes and data.

### Database of Saved Recipes

- Users can bookmark or store AI-generated recipes in a personal list.
- Basic CRUD operations on saved recipes.

### AI-Based Recipe Generation

- The app integrates with a recipe-generating AI API (e.g., ChatGPT or similar) that provides recipe suggestions based on user-provided ingredients.

---

## Beyond MVP Features

### Account Creation & Data Persistence

- Expand user profiles to store additional data, such as daily food logs.

### Calorie Tracking

- Log daily caloric intake from consumed recipes.
- Subtract exercise calories to see net daily calorie totals.

### Additional APIs

- **Calorie Estimator** (e.g., Nutronixs or other): Estimate the calories of a recipe.
- **Google Calendar**: Schedule meals directly on a user's calendar.
- **Enhanced ChatGPT**: Generate more personalized recipes.

---

## Technologies Used

### Front End:

- **React** (Single Page Application)
- **JavaScript / JSX**
- **HTML / CSS** or a CSS-in-JS solution / library (e.g., Chakra UI, Material UI, etc.)

### Back End (Python-based):

- **FastAPI or Flask** (or another Python web framework)
- **MongoDB** (using an ODM like PyMongo or MongoEngine)
- **JWT** (for authentication)
- **Render** (for deployment)

### Third-Party APIs:

- **ChatGPT** (or comparable AI) for recipe generation.
- **Nutronixs** (optional) for calorie estimation.
- **Google Calendar** (optional) for meal scheduling.

---

## Architecture

### Client (React)

- **Landing Page**: Features a sign-on option (login/register).
- **Home Page**: Displays a navigation bar, possible featured recipes, or user's existing bookmarks.
- **Navigation Bar**: Provides links to home, saved recipes, a "Create Recipe" form, and user profile/dashboard.
- **Saved Recipes Page**: Displays the user's bookmarked recipes.
- **Create Recipe Page**: Allows users to build a recipe by specifying a name, ingredients, and cooking steps.
- **(Optional) Dashboard**: Personal logs of total calories, scheduled meals, and exercise tracking.

### Server (Python + MongoDB)

- **User Management**: Endpoints for sign up, login, JWT refresh.
- **Recipes**: Endpoints for generating new recipes (via AI), saving them to MongoDB, reading saved recipes, updating or deleting them.
- **Calorie Logging**: Endpoints for logging daily calorie consumption and exercise offset.

#### Database:

- **users** collection for user profiles, credentials, and logs.
- **recipes** collection for storing user-generated or AI-suggested recipes.

---

## Database Schema

Below is a simple example of potential collections. Adjust field names as needed:

### Users Collection

```json
{
  "_id": "ObjectID",
  "username": "string",
  "email": "string",
  "password_hash": "string",
  "savedRecipes": ["RecipeID", "RecipeID", ...],
  "calorieLog": [
    {
      "date": "Date",
      "caloriesConsumed": "number",
      "caloriesBurned": "number"
    }
  ]
}

###Reciepe Collection
{
  "_id": "ObjectID",
  "name": "string",
  "ingredients": ["string", "string", ...],
  "instructions": "string",
  "estimatedCalories": "number",
  "createdBy": "UserID",  // or "system" if created by AI
  "createdAt": "Date"
}

## Usage
Register a new account or log in with your credentials.
Enter Ingredients on the "Create Recipe" page or dedicated AI recipe page to generate suggestions.
Bookmark or save any recipe you like.
Check your Saved Recipes in the dedicated panel or page.
*(Optional)* Track Calories by logging how many calories you consumed vs. exercised away.
*(Optional)* Use the Google Calendar integration to schedule meal times.
Explore new recipes every day using ChatGPT for more variety!

## Future Enhancements
- **AI-Driven Nutritional Analysis**: Expand the app to show more detailed macro/micronutrient breakdowns using advanced APIs.
- **Community Features**: Enable social functionalities like comments on recipes, rating, and sharing.
- **Notifications/Reminders**: Set mealtime reminders or push notifications (via email or phone).
- **Recipe Photo Upload**: Let users upload images of their creations.
- **Offline Support**: Cache key functionality to allow limited offline use.

## License
This project is licensed under the **MIT License**. Feel free to modify the code for personal or commercial use.
```
