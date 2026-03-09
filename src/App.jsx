import React from 'react';
import LandingPage from './User/LandingPage';
import RegistrationModal from './Components/RegistrationModal';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './Pages/HomePage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    children: [
      {
        path: "Register",
        element: <RegistrationModal />,
        
      }
    ]
  },
  {
    path: "HomePage",
        element: <HomePage />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;