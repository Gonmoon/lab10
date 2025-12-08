export default function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <div style={{ padding: '0.5rem 1rem', background: '#ffd6d6', color: '#900', marginBottom: '1rem' }}>
      {message}
    </div>
  );
}
