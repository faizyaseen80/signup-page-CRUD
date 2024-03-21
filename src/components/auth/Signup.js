import React, { useState } from "react";
import "./signup.css";
import { Link, useNavigate } from 'react-router-dom'

export const SignUp = () => {

  const [credentials, setCredentials] = useState({ name: "", email: "", password: ""}) 
  let navigate = useNavigate();

  const handleSubmit = async (e) => {

      e.preventDefault();
      const { name, email, password } = credentials

      const response = await fetch("http://localhost:5000/api/auth/createuser", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({name, email, password})
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
        <h2>Create Account</h2>
    <form onSubmit={handleSubmit}>
        <div className="user-box">
                <input type="text" name="name" id="name" onChange={onChange} />
                <label htmlFor='name'>name</label>
            </div>
        <div className="user-box">
                <input type="text" name="email" id="email" onChange={onChange} />
                <label htmlFor='email'>Email</label>
            </div>
            <div className="user-box">
                <input type="password" name="password" id="password" onChange={onChange} />
                <label htmlFor='password'>Password</label>
                <p style={{ color: "#666767", fontSize: "13px" }}>
            Passwords must contain at least eight characters, <br />
            including at least 1 letter and 1 ,<br />
            number.
          </p>
            </div>
            <div className="button-form">
                <button type="submit" id="submit">Signup</button>
                <div id="register">Already have an account ?<Link to="/login" className='switch-btn'> Login</Link></div>
            </div>
        </form>
        </div>
  </>
  );
};