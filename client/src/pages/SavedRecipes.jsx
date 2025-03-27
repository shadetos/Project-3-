import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch saved recipes from the server
    const fetchRecipes = async () => {
      try {
        setLoading(true);

        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Not authenticated");
        }

        const response = await fetch("/api/recipes/saved", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setRecipes(data.recipes || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
        setError("Failed to load your saved recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeleteId(id);
      setShowConfirmModal(true);
    } catch (error) {
      console.error("Error preparing to delete recipe:", error);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/recipes/saved/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setRecipes(recipes.filter((recipe) => recipe._id !== deleteId));
      setShowConfirmModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setShowConfirmModal(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteId(null);
  };

  const handleView = (id) => {
    navigate(`/recipes/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/recipes/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading your saved recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Error
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>{error}</p>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Recipes</h1>
          <Link
            to="/create-recipes"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Recipe
          </Link>
        </div>

        {recipes.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg py-12">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No saved recipes
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't saved any recipes yet. Start by discovering recipes
                or creating your own!
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Discover Recipes
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {recipes.map((recipe) => (
                <li
                  key={recipe._id}
                  className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-indigo-600 truncate">
                        {recipe.name || recipe.title}
                      </h2>
                      {recipe.ingredients && (
                        <p className="mt-1 text-sm text-gray-500">
                          {recipe.ingredients.slice(0, 3).join(", ")}
                          {recipe.ingredients.length > 3 ? "..." : ""}
                        </p>
                      )}
                      {recipe.estimatedCalories && (
                        <p className="mt-1 text-sm text-gray-500">
                          {recipe.estimatedCalories} calories
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleView(recipe._id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(recipe._id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(recipe._id || recipe.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Recipe
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this recipe? This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
