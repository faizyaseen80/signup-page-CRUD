import React, { useState } from 'react'
import { useNavigate, Link } from "react-router-dom"

export const Login = () => {

    const [credentials, setCredentials] = useState({email: "", password: ""}) 
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        });

        const json = await response.json()

        if (json.success){
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken); 
            navigate("/");

        }
        else{
            alert("Invalid credentials");
        }
    }


    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

  return (
    <>
    <div className="login-box">
        <h2>Login</h2>
    <form onSubmit={handleSubmit}>
        <div className="user-box">
                <input type="text" name="email" onChange={onChange} value={credentials.email} required />
                <label htmlFor='email'>Email</label>
            </div>
            <div className="user-box">
                <input type="password" name="password" id="password" onChange={onChange} value={credentials.password} required />
                <label htmlFor='password'>Password</label>
            </div>
            <div className="button-form">
                <button type='submit' id="submit">Login</button>
                <div id="register">Don't have an account ? <Link to="/signup" className='switch-btn'>Signup</Link></div>
            </div>
        </form>
        </div>
    </>
  )
}
