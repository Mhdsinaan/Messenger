import React from 'react'
import LandingPage from './User/LandingPage'
import RegistrationModal from './Components/RegistrationModal'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatWindow from './Components/ChatWindow'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    children: [
      {
        path: "Register",
        element: <RegistrationModal />
      }
    ]
  },
  {
    path: "/HomePage",
    element: <HomePage />,
    children: [
      {
        path: "chat/:senderId/:receiverId",
        element: <ChatWindow />
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App