import React from 'react'
import { Link, useRoutes } from 'react-router'

import Homepage from "./pages/Homepage.jsx"

function App() {

    const element  = useRoutes([
        {
            path: "/",
            element: <Homepage/>
        }
    ])

    return (
        <div className="App">

        <div className="header">
            <h1>PotluckHub</h1>
        </div>
            {element}
        </div>
    )
}

export default App