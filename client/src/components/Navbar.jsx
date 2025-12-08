import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        background: '#003366',
        color: '#fff'
      }}
    >
      <div>Belpost</div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/editions" style={{ color: '#fff' }}>
          Издания
        </Link>
        {/* по аналогии можно добавить /recipients, /subscriptions */}
      </div>
    </nav>
  );
}
