import React from 'react';
import { Link } from 'react-router-dom';

function UserMenu({ user, onLogout }) {
  return (
    <div className="user-menu">
      <span className="user-email">{user?.email}</span>
      {user?.role === 'admin' && (
        <Link to="/admin" className="admin-dashboard-link">Admin Dashboard</Link>
      )}
      <button onClick={onLogout} className="logout-button">Logout</button>
    </div>
  );
}

export default UserMenu;