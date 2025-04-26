import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './components/Navbar'
import Card from './components/Card.jsx'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import Footer from './components/Footer'
import Home from './Home/Home'
import Signup from './Signup/signup.jsx'
import Loginresult from './Loginresult/Loginresult.jsx'
import Login from './Login/Login.jsx'
import About from './About/About.jsx'
import History from './History/History.jsx'
import { AuthProvider } from './context/AuthContext';


export const mystyle = (imageurl) => ({
  width: "100vw",
  height: "100vh",
  backgroundImage: `url(${imageurl})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});


const router = createBrowserRouter([
  
  {//home
    path: "/",
    element: <> <div className="bodyimage" style={mystyle("network11.jpg")} >
      <Navbar /> <Home />
      <Footer />
    </div> </>
  },

  {//login page
    path: "/login",
    element: <>
      <div className="body" style={mystyle("laptop4.jpg")} >
      <Navbar />
        <Card />
        <Footer />
      </div>
    </>

  },
  {//signup page
    path: "/signup",
    element: <>
      <div className="body" style={mystyle("system.jpg")} >
        <Navbar />
        <Signup />
        <Footer />
      </div>
    </>

  },
    {//login result page
      path: "/result",
      element: 
      <>
        <div className="body" style={mystyle("network3.jpg")} >
          <Navbar />
          <Loginresult/>
          <Footer />
        </div>
      </>
  
    },
    {//about page
      path: "/about",
      element: 
      <>
        <div className="body" style={mystyle("laptop5.jpg")} >
          <Navbar />
          <About/>
          <Footer />
        </div>
      </>
  
    },
     {//history page
      path: "/history",
      element: 
      <>
        <div className="body" style={mystyle("network7.jpg")} >
          <Navbar />
          <History/>
          <Footer />
        </div>
      </>
  
    }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <AuthProvider>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
    </AuthProvider>
  </StrictMode>
)
