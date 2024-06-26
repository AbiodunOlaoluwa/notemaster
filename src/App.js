import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import DashBoard from './Pages/DashBoard/DashBoard';
import CreateText from './Pages/CreateText/CreateText';
import TextsPage from './Pages/TextsPage/TextsPage';
import SignIn from './Pages/AuthPages/SignIn/SignIn';
import CreateAccount from './Pages/AuthPages/CreateAccount/CreateAccount';
import EditPage from './Pages/EditPage/EditPage';
import ExceptionPage from './Pages/404Page/404Page';
import Recommendations from './Pages/RecommendationsPage/Recommendations';
import Layout from './Layout';
import PrivateRoute from './Components/PrivateRoute';
import AuthRoute from './Components/AuthRoute';
import { UserProvider } from './context/UserContext';

axios.defaults.withCredentials = true;

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthRoute element={<SignIn />} />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<PrivateRoute element={<DashBoard />} />} />
            <Route path="/createText" element={<PrivateRoute element={<CreateText />} />} />
            <Route path="/textsPage" element={<PrivateRoute element={<TextsPage />} />} />
            <Route path="/editPage" element={<PrivateRoute element={<EditPage />} />} />
            <Route path="/recommendations" element={<PrivateRoute element={<Recommendations />} />} />
          </Route>
          <Route path="/*" element={<ExceptionPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
