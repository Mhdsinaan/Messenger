import React, { useState } from "react";

function ProfileModal({ closeModal, setProfile }) {

  const [user, setUser] = useState({
    name: "",
    bio: "",
    image: null,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  function handleImage(e) {
    setUser({ ...user, image: e.target.files[0] });
  }

  function handleSubmit(e) {
    e.preventDefault();

    setProfile(user);   // send data to HomePage
    closeModal();       // close modal
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-96 rounded-xl shadow-lg p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <button onClick={closeModal}>✖</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img
              src={
                user.image
                  ? URL.createObjectURL(user.image)
                  : "https://i.pravatar.cc/100"
              }
              alt="profile"
              className="w-24 h-24 rounded-full object-cover mb-2"
            />

            <input
              type="file"
              onChange={handleImage}
              className="text-sm"
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">User Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Enter your name"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm text-gray-600">Bio</label>
            <textarea
              name="bio"
              value={user.bio}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Write something about you..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            Save Profile
          </button>

        </form>

      </div>

    </div>
  );
}

export default ProfileModal;