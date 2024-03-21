import React, {useEffect } from 'react'
import './home.css'
import { useNavigate } from 'react-router-dom'

const Home = () => {

    let navigate = useNavigate()
    let token = localStorage.getItem("token")
    
    const fetchuser = async() => {
        const response = await fetch('http://localhost:5000/api/auth/getuser', {
            method: 'POST',
            headers: {
                'auth-token': token
            }
        })
        let json = await response.json()
        return json
    }
    
    let id;

    fetchuser().then((value) => {
        const name = document.getElementById("name")
        const email = document.getElementById("email")
        name.innerHTML =`Name : ${ value.name}`
        email.innerHTML =`Email : ${ value.email}`
        id = value._id;
    })

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    useEffect(() => {
      if (localStorage.getItem("token")) {
          navigate('/')
        } else {
            navigate('/login')
        }
        // eslint-disable-next-line
}, [])

    const deleteUser = async (id) => {
        try {
            const response  = await fetch(`http://localhost:5000/api/auth/deleteuser/${id}`, {
                method: 'DELETE',
                headers: {
                    'auth-token': token
                }
            });
            
            const json = await response.json();
            return json;
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    }


  return (
    <>
        <nav>
            <ul>
                <li>
                    Home
                </li>
            </ul>
                <button onClick={handleLogout}>Logout</button> 
                <button onClick={handleLogout}>Update profile</button> 
                <button onClick={() => handleDelete(id)}>Delete profile</button> 
        </nav>
        <div className='container'>
            <h1>Welcome</h1>
            <div className='home-container'>
                <p id='name'>User Name :</p>
                <p id='email'>Email :&nbsp;</p>
            </div>
        </div>
        </>
  )
}

export default Home