import './App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import ForgetPassword from './features/auth/pages/ForgetPassword'
import ResetPassword from './features/auth/pages/ResetPassword'
import VerifyPassword from './features/auth/pages/VerifyPassword'
import { useState } from 'react'
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

function App() {
  const [showLoader, setShowLoader] = useState(() => {
    if (window.location.pathname !== '/') {
      return false;
    }
    const hasSeenLoader = sessionStorage.getItem('hasSeenLoader');
    if (!hasSeenLoader) {
      // Set it immediately so that a reload won't trigger it again
      sessionStorage.setItem('hasSeenLoader', 'true');
      return true;
    }
    return false;
  })

  const handleLoaderComplete = () => {
    setShowLoader(false)
  }

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

  return (
    <>
      {showLoader && (
        <Loader onComplete={handleLoaderComplete} />
      )}
      <RouterProvider router={router} />
    </>
  )
}

export default App
