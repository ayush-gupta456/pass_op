import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import Manager from './components/Manager';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="bg-purple-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Manager />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
