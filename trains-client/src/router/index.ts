import LoginPage from "../pages/loginPage"
import ProfilePage from "../pages/profilePage"
import RegistrationPage from "../pages/registrationPage"
import TrainsPage from "../pages/trainsPage"

export const privateRoutes = [
]

export const publicRoutes = [
    { path: '/registration', element: RegistrationPage },
    { path: '/login', element: LoginPage },
    { path: '/trains', element: TrainsPage},
    { path: '/profile', element: ProfilePage},
]