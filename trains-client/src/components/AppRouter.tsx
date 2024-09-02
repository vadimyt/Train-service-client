import { useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { publicRoutes, privateRoutes } from "../router"

const AppRouter = () => {
    return (
        <Routes>
            {publicRoutes.map(route =>
                <Route
                    Component={route.element}
                    path={route.path}
                    key={route.path} />
            )}
        </Routes>
    )
}

export default AppRouter