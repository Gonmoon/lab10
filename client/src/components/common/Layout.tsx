import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Главная', icon: '🏠' },
    { path: '/editions', label: 'Издания', icon: '📰' },
    { path: '/recipients', label: 'Получатели', icon: '👤' },
    { path: '/subscriptions', label: 'Подписки', icon: '📋' },
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>📮 Белпочта - Система подписок</h1>
            </div>
            <nav className="main-nav">
              <ul className="nav-list">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Белпочта - Система управления подписками</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;