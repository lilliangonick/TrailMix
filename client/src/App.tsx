import { Button, HStack } from "@chakra-ui/react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Login } from "./pages/Login/Login"
import { Signup } from "./pages/Login/Signup"

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
      </Routes>
    </BrowserRouter>
  )
}