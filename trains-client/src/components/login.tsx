import axios, { AxiosError } from "axios";
import { FC, useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from "../utility/hook";
import { updateUserData } from "../store/userSlice";
import Cookies from 'js-cookie';

const Login: FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [errorText, setErrorText] = useState<string>("");
    const login = () => {
        axios.post("http://127.0.0.1:8000/security/login/", {
            withCredentials: true,
            email: data.email,
            password: data.password
        }).then((res) => {
            setErrorText("")
            console.log("Server response: ", res);
            //Cookies.set('trains_cookie', res.data.access);
            dispatch(updateUserData(res.data.user))
            navigate("/trains")
        }).catch((err) => {
            console.log("Server respondend with error: ", err);
            switch (err.status)
            {
            case 400:
                setData({ ...data, password:""})
                setErrorText("Введена неверная почта/пароль")
                break
            }
        })
    }
    return (
        <div className="container">
            <div className="header">
                <div className="text">Login</div>
            </div>
            <div className="inputs">
                <div className="input">
                    <input value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="email" type="email"></input>
                </div>
                <div className="input">
                    <input value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} placeholder="password" type="password"></input>
                </div>
            </div>
            <div>
                {errorText != "" ?
                    <>
                        <label style={{ color: 'red' }}>{errorText}</label>
                    </>
                    :
                    <>

                    </>}
            </div>
            <div className="submit-container">
                <button onClick={() => navigate("/registration")} className="submit">Sign Up</button>
                <button onClick={() => login()} className="submit">Login</button>
            </div>
        </div>
    )
}

export default Login