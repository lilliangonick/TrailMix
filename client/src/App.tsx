import { Button, HStack } from "@chakra-ui/react"
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Login } from "./pages/Login/Login"
import { Signup } from "./pages/Signup/Signup"
import ResetPwd from "./pages/ResetPwd/ResetPwd";
import Home from "./pages/Home/Home";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/resetpwd" element={<ResetPwd/>} />
        <Route path="/home" element={<Home/>} />
      </Routes>
    </BrowserRouter>
  )
}