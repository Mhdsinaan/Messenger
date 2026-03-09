import React, { useState } from 'react';
import RegistrationModal from '../Components/RegistrationModal';
import LoginModal from '../Components/LoginModal';  
function LandingPage() {

  const [openRegister, setOpenRegister] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  return (
    <div
      className="font-sans min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1525182008055-f88b95ff7980')",
      }}
    >
      <div className="bg-black/60 min-h-screen">

        {/* NAV */}
        <nav className="flex items-center justify-between px-16 py-5 border-b border-white/20">
          <div className="flex items-center gap-2">
            <span className="text-2xl text-white">💬</span>
            <span className="font-bold text-lg text-white">
              MessengerGram
            </span>
          </div>

          <div className="flex gap-3">

            {/* 🔥 LOGIN BUTTON */}
            <button
              onClick={() => setOpenLogin(true)}
              className="px-5 py-2 rounded-lg border border-white/40 text-sm text-white hover:bg-white/20 transition"
            >
              Log in
            </button>

            {/* 🔥 REGISTER BUTTON */}
            <button
              onClick={() => setOpenRegister(true)}
              className="px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition"
            >
              Register
            </button>

          </div>
        </nav>

        {/* HERO */}
        <div className="flex flex-col items-center justify-center text-center px-5 pt-32 pb-20 text-white">
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Chat with anyone,<br />anytime.
          </h1>
          <p className="max-w-md leading-relaxed mb-10 text-gray-200">
            MessengerGram is a simple, fast, and secure messaging app for staying connected 
            with the people you care about.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() =>setOpenLogin(true)}
              className="px-8 py-3 rounded-lg bg-violet-600 text-white font-bold hover:bg-violet-700 transition"
            >
              Get Started →
            </button>
          </div>
        </div>

        {/* 🔥 Registration Modal */}
        {openRegister && (
          <RegistrationModal closeModal={() => setOpenRegister(false)} />
        )}

        {/* 🔥 Login Modal */}
        {openLogin && (
          <LoginModal closeModal={() => setOpenLogin(false)} />
        )}

      </div>
    </div>
  );
}

export default LandingPage;