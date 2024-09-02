import axios, { AxiosError } from "axios";
import { FC, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from "../utility/hook";
import { updateUserData } from "../store/userSlice";

const Registration: FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        password1: "",
        password2: "",
    });
    const [errorText, setErrorText] = useState<string>("");
    const register = () => {
        if (data.email == "" || data.password1 == "" || data.password2 == "") {
            setErrorText("Не все поля заполнены")
        }
        else {
            axios.post("http://127.0.0.1:8000/security/registration/", {
                email: data.email,
                password1: data.password1,
                password2: data.password2,
                withCredentials: true,
            }).then((res) => {
                setErrorText("")
                console.log("Server response: ", res);
                dispatch(updateUserData(res.data.user))
                navigate("/trains")
            }).catch((err: AxiosError) => {
                console.log("Server respondend with error: ", err);
                switch (err.status) {
                    case 400:
                        setData({ ...data, password1: "" })
                        setData({ ...data, password2: "" })
                        setErrorText(err.response?.request.response)
                        break
                }
            })
        }
    }
    return (
        <div className="container">
            <div className="header">
                <div className="text">Sign Up</div>
            </div>
            <div className="inputs">
                <div className="input">
                    <input value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="email" type="email"></input>
                </div>
                <div className="input">
                    <input value={data.password1} onChange={(e) => setData({ ...data, password1: e.target.value })} placeholder="password" type="password"></input>
                </div>
                <div className="input">
                    <input value={data.password2} onChange={(e) => setData({ ...data, password2: e.target.value })} placeholder="repeat password" type="password"></input>
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
                <button onClick={() => register()} className="submit">Sign Up</button>
                <button onClick={() => navigate("/login")} className="submit">Login</button>
            </div>
        </div>
    )
}

export default Registration