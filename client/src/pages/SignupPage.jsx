import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(userData);
    try {
      console.log(userData);
      const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
  };

  const handleInput = (target) => {
    if (target.name === "name") {
      setUserData({ ...userData, name: target.value });
    } else if (target.name === "email") {
      setUserData({ ...userData, email: target.value });
    } else if (target.name === "password") {
      setUserData({ ...userData, password: target.value });
    }
  };

  return (
    <section className="bg-[#131921]">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div className="w-full  rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-gray-300">
              Sign Up
            </h1>
            <form className="space-y-4 md:space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                  onChange={(e) => handleInput(e.target)}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@example.com"
                  required=""
                  onChange={(e) => handleInput(e.target)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className=" border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  required=""
                  autoComplete=""
                  onChange={(e) => handleInput(e.target)}
                />
              </div>

              <button
                type="submit"
                className="w-full text-white hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <span
                  className="font-medium hover:underline text-primary-500 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignupPage;
