// TODO: Main home page that welcomes users, suggests recipes, or shows highlights.
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [recipes] = useState([
    { name: "Spaghetti Carbonara", description: "A classic Italian pasta dish with eggs, cheese, pancetta, and pepper." },
    { name: "Avocado Toast", description: "A simple yet delicious toast topped with fresh avocado, lime, and spices." },
    { name: "Chocolate Chip Cookies", description: "Chewy, warm, and packed with chocolate chips." },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Welcome to Recipe Haven</h1>
        <p className="text-lg text-gray-700 text-center mb-8">
          Explore delicious recipes and find inspiration for your next meal!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {recipes.map((recipe, index) => (
            <Card key={index} className="bg-white p-4 shadow-lg rounded-2xl">
              <CardContent>
                <h2 className="text-2xl font-semibold">{recipe.name}</h2>
                <p className="text-gray-600 mt-2">{recipe.description}</p>
                <Button className="mt-4">View Recipe</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
