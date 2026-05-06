import './App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import ForgetPassword from './features/auth/pages/ForgetPassword'
import ResetPassword from './features/auth/pages/ResetPassword'
import VerifyPassword from './features/auth/pages/VerifyPassword'
import { useState, useEffect } from 'react'
import Loader from './features/auth/components/Loader'
import Home from './features/Products/pages/Home'
import AppLayout from './features/Products/pages/Applayout'
import Product from './features/Products/pages/Product'
import DetailProduct from './features/Products/pages/DetailProduct'
import Protected from './features/Products/components/Protected'
import SellerProductCreate from './features/Products/pages/SellerProductCreate'
import SellerAllproducts from './features/Products/pages/SellerAllproducts'
import SellerLayout from './features/Products/pages/SellerLayout'
import SellerDetailProducts from './features/Products/pages/SellerDetailProducts'
import { useAuth } from './features/auth/hooks/auth.hook'
import Cart from './features/Cart/Pages/Cart'
import Profile from './features/Products/pages/Profile'
import EditProfile from './features/Products/pages/EditProfile'

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  }, {
    path: "/register",
    element: <Register />
  }, {
    path: "/",
    element:<AppLayout />
    ,children:[
      {
        path:"/",
        element:<Home />
      },{
        path:"/men",
        element:<Product />
      },{
        path:"/women",
        element:<Product />
      },{
        path:"/sneakers",
        element:<Product />
      },{
        path:"/product/:id",
        element:<DetailProduct />
      },
      {
        path:"/cart",
        element:<Cart />
      },
      {
        path:"/profile",
        element:<Profile />
      },
      {
        path:"/edit-profile",
        element:<EditProfile />
      }
    ]
  },
  {
path:"/seller",
element:
<Protected>
<SellerLayout />
</Protected>
,children:[
{
  path:"/seller",
  element:<SellerAllproducts />
},
{
  path: "/seller/createProduct",
  element: <SellerProductCreate />
},
{
  path: "/seller/product/:id",
  element: <SellerDetailProducts />
}
]

  },
  {
    path: "/forget-password",
    element: <ForgetPassword />
  }, {
    path: "/verify-password",
    element: <VerifyPassword />
  }, {
    path: "/reset-password",
    element: <ResetPassword />
  }
])

function App() {
  const { HandleGetme } = useAuth();
  const [showLoader, setShowLoader] = useState(() => {
    // Only show loader on the home page root path
    return window.location.pathname === '/';
  })

  useEffect(() => {
    HandleGetme();
  }, []);

  const handleLoaderComplete = () => {
    setShowLoader(false)
  }

  return (
    <>
      <RouterProvider router={router} />
      {showLoader && (
        <Loader onComplete={handleLoaderComplete} />
      )}
    </>
  )
}

export default App
