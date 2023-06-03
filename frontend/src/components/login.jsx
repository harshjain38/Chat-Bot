/* eslint react/prop-types: 0 */
import {useState} from "react";
import "./log.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({setLoginUser}){

    const navigate=useNavigate();

    const [ user, setUser] = useState({
        email:"",
        password:""
    })

    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const login = () => {
        axios.post("http://localhost:8000/login", user)
        .then(res => {
            alert(res.data.message);
            // console.log(res.data.user);
            setLoginUser(res.data.user);
            navigate("/");
        })
    }

    const handleClick=()=>{
        navigate("/register");
    }

    return (
        <div className="log">
            <h1>Login</h1>
            <input type="text" name="email" value={user.email} onChange={handleChange} placeholder="Enter your Email"></input>
            <input type="password" name="password" value={user.password} onChange={handleChange}  placeholder="Enter your Password" ></input>
            <div className="button butup" onClick={login}>Login</div>
            <div>or</div>
            <div className="button" onClick={handleClick}>Register</div>
        </div>
    )
}

export default Login;