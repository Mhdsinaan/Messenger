import React, { useState } from "react";
import api from "../../api/Api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

function LoginModal({ closeModal }) {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {

    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }

  }

  async function handleSubmit(e) {

    e.preventDefault();

    const newErrors = {};

    if (!formData.email.includes("@"))
      newErrors.email = "Valid email required";

    if (formData.password.length < 6)
      newErrors.password = "Min. 6 characters";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {

      const response = await api.post("/Auth/Login", {
        email: formData.email,
        password: formData.password
      });

      const userData = response.data.data;

      localStorage.setItem("token", userData.token);

      const decoded = jwtDecode(userData.token);

      const userId = decoded.userId;
      const username = decoded.unique_name;
      const role = decoded.role;

      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      alert("Logged In Successfully ✅");

      navigate("/HomePage");

      closeModal();

    } catch (error) {

      console.error("Login Error:", error);

      alert("Login Failed ❌");

    }
  }

  // GOOGLE LOGIN
  async function handleGoogleLogin(credentialResponse) {

    try {

      const response = await api.post("/Auth/GoogleLogin", {
        idToken: credentialResponse.credential
      });

      const userData = response.data.data;

      localStorage.setItem("token", userData.token);

      const decoded = jwtDecode(userData.token);

      const userId = decoded.userId;
      const username = decoded.unique_name;
      const role = decoded.role;

      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      alert("Google Login Successful ✅");

      navigate("/HomePage");

      closeModal();

    } catch (error) {

      console.error("Google Login Error:", error);

      alert("Google Login Failed ❌");

    }

  }

  return (

    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

      <div className="flex w-[680px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 relative">

        {/* Left Image */}
        <div className="w-64 flex-shrink-0 relative">
          <img
            src="/src/assets/Images/num1.png"
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="flex-1 p-8 relative">

          <button
            onClick={closeModal}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition text-sm"
          >
            ✕
          </button>

          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Log In
          </h2>

          <p className="text-xs text-gray-400 mb-6">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`w-full px-4 py-2 text-sm rounded-lg border outline-none transition
                ${errors.email
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                  }`}
              />

              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email}
                </p>
              )}

            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-2 text-sm rounded-lg border outline-none transition
                ${errors.password
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                  }`}
              />

              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password}
                </p>
              )}

            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg"
            >
              Sign In
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-grow border-t"></div>
            <span className="px-3 text-xs text-gray-400">OR</span>
            <div className="flex-grow border-t"></div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Google Login Failed")}
            />
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            Don't have an account?{" "}
            <span className="text-indigo-500 cursor-pointer hover:underline">
              Create one
            </span>
          </p>

        </div>

      </div>

    </div>

  );
}

export default LoginModal;