import { useState } from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import DashBoard from './Pages/DashBoard/DashBoard';
import SignIn from './Pages/AuthPages/SignIn/SignIn';
import CreateAccount from './Pages/AuthPages/CreateAccount/CreateAccount';

function App() {

  const [isUserLoggedIn, setUserLogIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isUserLoggedIn ? <DashBoard /> : <LandingPage logInStatus={isUserLoggedIn} setLogIn={setUserLogIn} />} />
        <Route path="/signIn" element={isUserLoggedIn ? <Navigate to="/dashBoard" replace /> : <SignIn />} />
        <Route path="createAccount" element={isUserLoggedIn ? <Navigate to="/dashBoard" replace /> : <CreateAccount />} />
        {/* <Route element={<Layout />}>
        </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
