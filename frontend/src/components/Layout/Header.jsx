import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from '../Auth/UserMenu';

function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">E-Commerce</Link>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          {user ? (
            <>
              <Link to="/orders">Orders</Link>
              <UserMenu user={user} onLogout={onLogout} />
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/register" className="register-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;