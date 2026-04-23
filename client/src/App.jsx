import React from "react";
import { Link, useRoutes } from "react-router";

import Homepage from "./pages/Homepage.jsx";
import Register from "./pages/Register.jsx";

function App() {
  const element = useRoutes([
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div className="App">
      <div className="header">
        <h1>PotluckHub</h1>
      </div>
      {element}
    </div>
  );
}

export default App;
