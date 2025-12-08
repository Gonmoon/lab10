import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem' }}>{children}</main>
    </div>
  );
}
