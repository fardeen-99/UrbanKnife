import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import ForgetPassword from './features/auth/pages/ForgetPassword'
import ResetPassword from './features/auth/pages/ResetPassword'
import VerifyPassword from './features/auth/pages/VerifyPassword'
function App() {
  
  const router=createBrowserRouter([
  {
    path:"/login",
    element:<Login/>
  },{
    path:"/register",
    element:<Register/>
  },{
    path:"/",
    element:(<h1>Home</h1>)
  }
  ,{
    path:"/forget-password",
    element:<ForgetPassword/>
  },{
    path:"/verify-password",
    element:<VerifyPassword/>
  },{
    path:"/reset-password",
    element:<ResetPassword/>
  }
])

  return(
<RouterProvider router={router}/>
  )
}

export default App
