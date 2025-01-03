import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Password from "../../components/input/password";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again!");
      }
    }
  };

  return (
    <div className="h-screen bg-login-bg-img from-cyan-50 to-cyan-100 flex items-start justify-end p-8">
      <div className="w-full max-w-md bg-gray-800 bg-opacity-80 shadow-lg rounded-lg p-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h4 className="text-3xl font-bold text-white mb-2">
            Capture Your <br /> Journeys
          </h4>
          <p className="text-gray-300">
            Record your travel experiences and memories in your personal travel
            journal.
          </p>
        </div>

        {/* Login Form */}
        <div>
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold text-white mb-6 text-center">
              Login
            </h4>
            {/* Email Input */}
            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              value={email}
              onChange={({ target }) => {
                setEmail(target.value);
              }}
            />

            {/* Password Input */}
            <Password
              value={password}
              onChange={({ target }) => {
                setPassword(target.value);
              }}
            />

            <br />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition duration-300"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="border-t flex-grow border-gray-500"></div>
              <span className="mx-2 text-gray-400">Or</span>
              <div className="border-t flex-grow border-gray-500"></div>
            </div>

            {/* Create Account Button */}
            <button
              type="button"
              className="w-full bg-gray-700 text-gray-300 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
