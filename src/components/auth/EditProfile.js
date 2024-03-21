import React, {useState} from 'react'
import './home.css'
import { useNavigate } from 'react-router-dom'


function EditProfile() {

  let navigate = useNavigate()
    let token = localStorage.getItem("token")
    let userInitial = []
    const [user, setUser] = useState(userInitial)

  const editUser = async (id, name, email, password) => {
    // API Call 
    const response = await fetch(`http://localhost:5000/api/auth/updateuser/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": token
      },
      body: JSON.stringify({name, email, password})
    });
    const json = await response.json(); 

     let newUser = JSON.parse(JSON.stringify(user))
    // Logic to edit in user
      if (newUser._id === id) {
        newUser.name = name;
        newUser.email = email;
        newUser.password = password; 
      }
    }  
    setUser(newUser);
  

  return (
    <>
    <div className="login-box">
        <h2>Create Account</h2>
    <form onSubmit={handleSubmit}>
        <div className="user-box">
                <input type="text" name="ename" id="name" onChange={onChange} />
                <label htmlFor='name'>name</label>
            </div>
        <div className="user-box">
                <input type="text" name="eemail" id="email" onChange={onChange} />
                <label htmlFor='email'>Email</label>
            </div>
            <div className="user-box">
                <input type="password" name="epassword" id="password" onChange={onChange} />
                <label htmlFor='password'>Password</label>
            </div>
            <div className="button-form">
                <button type="submit" id="submit" onClick={editUser}>Update profile</button>
            </div>
        </form>
        </div>
    </>
  )
}

export default EditProfile