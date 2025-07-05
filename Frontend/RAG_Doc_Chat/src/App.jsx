import React from "react";
import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import Login from "./components/login"; // Your Login component
import Register from "./components/register"; // Your Register component
import Dashboard from "./components/dashboard"; // Uncomment if you have a Dashboard component

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
