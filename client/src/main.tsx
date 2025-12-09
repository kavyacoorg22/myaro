import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppStore } from './redux/appStore.tsx'
import { Provider } from 'react-redux'
import {GoogleOAuthProvider} from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    onScriptLoadError={() => console.log('Error loading Google script')}
      onScriptLoadSuccess={() => console.log('Google script loaded')}
    >
    <Provider store={AppStore}>
    <App />
  
    </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
