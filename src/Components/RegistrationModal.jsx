import React, { useState } from "react";
import axios from "axios";
import api from "../../api/Api";

function RegistrationModal({ closeModal }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.includes("@"))
      newErrors.email = "Valid email required";
    if (formData.password.length < 6)
      newErrors.password = "Min. 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {

      const response = await api.post("Auth/register", {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      alert("Registered Successfully ✅");

      console.log(response.data);

      closeModal();

    } catch (error) {

      console.error(error);

      alert("Registration Failed ❌");

    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

      <div className="flex w-[820px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 relative">

        {/* Left Image */}
        <div className="w-80 relative flex-shrink-0">
          <img
            src="src/assets/Images/num1.png"
            alt="Messaging Conversation"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form */}
        <div className="flex-1 p-8 relative">

          <button
            onClick={closeModal}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition text-sm"
          >
            ✕
          </button>

          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Create Account
          </h2>

          <p className="text-xs text-gray-400 mb-5">
            It's free and only takes a minute
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className={`w-full px-4 py-2 text-sm rounded-lg border outline-none transition
                focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                ${errors.name
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                  }`}
              />

              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`w-full px-4 py-2 text-sm rounded-lg border outline-none transition
                focus:ring-2 focus:ring-blue-200 focus:border-blue-400
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
                focus:ring-2 focus:ring-blue-200 focus:border-blue-400
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

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full px-4 py-2 text-sm rounded-lg border outline-none transition
                focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                ${errors.confirmPassword
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                  }`}
              />

              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white text-sm font-semibold rounded-lg shadow-sm"
            >
              Create Account
            </button>

          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            Already have an account?{" "}
            <span className="text-blue-500 cursor-pointer hover:underline">
              Sign in
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default RegistrationModal;