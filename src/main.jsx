import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { ChatProvider } from './Components/Context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
 <ChatProvider>
    <GoogleOAuthProvider clientId="761310030570-4kls5km4sl1n0p3rucifttijb7337osm.apps.googleusercontent.com">

      <App />

    </GoogleOAuthProvider>
    </ChatProvider>

  </StrictMode>,
)