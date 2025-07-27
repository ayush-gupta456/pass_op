import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current path
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="w-full text-white bg-slate-800">
      <div className="flex items-center justify-between px-4 py-5 mycontainer h-14">
        {/* Logo */}
        <div className="text-2xl font-bold text-white logo">
          <Link to="/">
            <span className="text-purple-400">&lt; </span>
            pass<span className="text-purple-400">KEEPER/ &gt;</span>
          </Link>
        </div>

        {/* Right Side Buttons */}
        <div>
          {token ? (
            // ✅ If logged in → show Logout
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-600 rounded-full"
            >
              Logout
            </button>
          ) : location.pathname === '/login' ? (
            // ✅ On /login → show Sign up
            <Link
              to="/signup"
              className="px-4 py-2 text-white bg-green-600 rounded-full"
            >
              Sign up
            </Link>
          ) : location.pathname === '/signup' ? (
            // ✅ On /signup → show Login
            <Link
              to="/login"
              className="px-4 py-2 text-white bg-blue-600 rounded-full"
            >
              Login
            </Link>
          ) : (
            // ✅ Default (not logged in, not on login/signup) → show Login only
            <Link
              to="/login"
              className="px-4 py-2 text-white bg-blue-600 rounded-full"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
