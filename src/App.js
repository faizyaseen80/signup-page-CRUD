import { SignUp } from './components/auth/Signup';
import { Route, Routes } from 'react-router-dom'
import { Login } from './components/auth/Login';
import Home from './components/home/Home';


function App() {

  
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/login' element={<Login />} />
      </Routes>
  );
}

export default App;
