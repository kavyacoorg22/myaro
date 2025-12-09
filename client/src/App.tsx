
import './App.css'
import AppRoute from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify';

function App() {
  

  return (
    <>
    <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
     <AppRoute/>
    </>
  )
}

export default App
