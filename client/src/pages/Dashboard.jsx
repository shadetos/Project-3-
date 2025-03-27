import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState({
    calorieLog: [],
    exerciseLogs: [],
    scheduledMeals: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("calories");
  const [dateRange, setDateRange] = useState("week");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const token = localStorage.getItem("token");
        const response = await fetch("/api/users/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setUserData({
          calorieLog: data.calorieLog || [],
          exerciseLogs: data.exerciseLogs || [],
          scheduledMeals: data.scheduledMeals || [],
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Calculate total calories consumed and burned
  const totalCaloriesConsumed = userData.calorieLog.reduce(
    (sum, entry) => sum + entry.caloriesConsumed,
    0
  );

  const totalCaloriesBurned = userData.calorieLog.reduce(
    (sum, entry) => sum + entry.caloriesBurned,
    0
  );

  const netCalories = totalCaloriesConsumed - totalCaloriesBurned;

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Your Dashboard</h1>
        <div className="flex space-x-2">
          <select
            className="bg-white border border-gray-300 rounded px-3 py-1 text-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
          <Link
            to="/add-log"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
          >
            Add New Entry
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">
            Calories Consumed
          </h3>
          <p className="text-2xl font-bold text-gray-800">
            {totalCaloriesConsumed} cal
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Calories Burned</h3>
          <p className="text-2xl font-bold text-green-600">
            {totalCaloriesBurned} cal
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Net Calories</h3>
          <p
            className={`text-2xl font-bold ${
              netCalories > 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {netCalories > 0 ? "+" : ""}
            {netCalories} cal
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === "calories"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("calories")}
          >
            Calorie Log
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === "exercise"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("exercise")}
          >
            Exercise Logs
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === "meals"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("meals")}
          >
            Scheduled Meals
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {activeTab === "calories" && (
          <div>
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Calorie Log
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Track your daily calorie intake and expenditure
              </p>
            </div>

            {userData.calorieLog.length > 0 ? (
              <div className="border-t border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Consumed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Burned
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userData.calorieLog.map((entry, index) => {
                      const net = entry.caloriesConsumed - entry.caloriesBurned;
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(entry.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.caloriesConsumed} cal
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                            {entry.caloriesBurned} cal
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              net > 0 ? "text-red-500" : "text-green-500"
                            }`}
                          >
                            {net > 0 ? "+" : ""}
                            {net} cal
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-gray-500">No calorie logs found</p>
                <Link
                  to="/add-calorie-log"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500"
                >
                  Add First Log
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "exercise" && (
          <div>
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Exercise Logs
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Track your workouts and physical activity
              </p>
            </div>

            {userData.exerciseLogs.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {userData.exerciseLogs.map((exercise, index) => (
                  <li key={index} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {exercise.type}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {exercise.duration} min
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <span>{exercise.caloriesBurned} cal</span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span>{formatDate(exercise.date)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-gray-500">No exercise logs found</p>
                <Link
                  to="/add-exercise-log"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500"
                >
                  Log Exercise
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "meals" && (
          <div>
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Scheduled Meals
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Plan your meals in advance
              </p>
            </div>

            {userData.scheduledMeals.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {userData.scheduledMeals.map((meal, index) => (
                  <li key={index} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {meal.recipeName}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {meal.mealType}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <span>{meal.calories} calories</span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span>{formatDate(meal.scheduledFor)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-gray-500">No scheduled meals found</p>
                <Link
                  to="/schedule-meal"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500"
                >
                  Schedule a Meal
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
