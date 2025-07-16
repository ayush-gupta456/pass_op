import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="w-full text-white bg-slate-800">
      <div className="flex items-center justify-between px-4 py-5 mycontainer h-14">
        <div className="text-2xl font-bold text-white logo">
          <Link to="/">
            <span className="text-purple-400">&lt; </span>
            pass<span className="text-purple-400">KEEPER/ &gt;</span>
          </Link>
        </div>
        <div>
          {token ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-600 rounded-full"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 mr-2 text-white bg-blue-600 rounded-full">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 text-white bg-green-600 rounded-full">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;