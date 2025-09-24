import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { removeAuthToken } from '../utils/auth';

interface HeaderProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const Header: React.FC<HeaderProps> = ({ user, setUser }) => {
  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          📚 BookReview
        </Link>
        
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/books">Books</Link>
          {user ? (
            <>
              <Link to="/add-book">Add Book</Link>
              <div className="user-info">
                <span>Welcome, {user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
