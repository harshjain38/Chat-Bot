import Home from "./components/home.jsx"
import Login from "./components/login.jsx"
import Register from "./components/register.jsx"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';

const App = () => {

  const [user, setLoginUser] = useState({});

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={user && user._id ? <Home setLoginUser={setLoginUser} /> : <Login setLoginUser={setLoginUser}/>} />
          <Route path="/login" element={<Login setLoginUser={setLoginUser}/>} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
