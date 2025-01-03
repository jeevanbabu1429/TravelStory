import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import Home from './pages/home/home';


import React from 'react'

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route path="/" exact element={<Root />}/>
        <Route path="/dashboard" exact element={<Home />}/>
        <Route path='/login' exact element={<Login />}/>
        <Route path='/signup' exact element={<Signup />}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

const Root = () =>{
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="Login" />
  )
}

export default App
