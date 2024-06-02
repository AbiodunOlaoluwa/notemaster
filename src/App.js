import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import DashBoard from './Pages/DashBoard/DashBoard';
import SignIn from './Pages/AuthPages/SignIn/SignIn';
import CreateAccount from './Pages/AuthPages/CreateAccount/CreateAccount';
import Layout from './Layout';
import PrivateRoute from './Components/PrivateRoute';
import AuthRoute from './Components/AuthRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthRoute element={<SignIn />} />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<PrivateRoute element={<DashBoard />} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
