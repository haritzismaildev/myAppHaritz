//import React from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UsersCrud from "./pages/UsersCrud";


function App() {
  // const [count, setCount] = useState(0)

  return (
    // <Router>
    //   <nav>
    //     <Link to="/register">Registrasi</Link> |
    //     <Link to="/login">Login</Link> |
    //     <Link to="/userscrud">Users Management</Link>
    //   </nav>

    //   <Routes>
    //     <Route path="/register" element={<Register />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/userscrud" element={<UsersCrud />} />
    //   </Routes>
    // </Router>
    <Router>
      <Routes>
        {/* Jika user mengakses "/", arahkan ke "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userscrud" element={<UsersCrud />} />
      </Routes>
    </Router>
  )
}

export default App
