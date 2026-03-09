import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <GoogleOAuthProvider clientId="761310030570-4kls5km4sl1n0p3rucifttijb7337osm.apps.googleusercontent.com">

      <App />

    </GoogleOAuthProvider>

  </StrictMode>,
)