import React from "react";

function SideNav({ openProfile, profile }) {
  return (
    <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-6 space-y-6">

      {/* Chat */}
      <button>💬</button>

      {/* Profile */}
      <button onClick={openProfile}>
        {profile.image ? (
          <img
            src={URL.createObjectURL(profile.image)}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <span className="text-xl">👤</span>
        )}
      </button>

      {/* Settings */}
      <button>⚙️</button>

    </div>
  )
}

export default SideNav