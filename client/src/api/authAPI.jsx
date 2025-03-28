import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo) => {
  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return await response.json(); // Return the parsed response data
  } catch (err) {
    console.error("Login error:", err);
    throw new Error("Could not authenticate user");
  }
};
const signup = async (userInfo) => {
  try {
    const response = await fetch("/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Signup failed");
    }

    return await response.json();
  } catch (err) {
    console.error("Signup error:", err);
    throw new Error("Could not authenticate user");
  }
};

export { login, signup };
