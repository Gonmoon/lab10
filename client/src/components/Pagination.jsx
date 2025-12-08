export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
      <button disabled={prevDisabled} onClick={() => onChange(page - 1)}>
        Назад
      </button>
      <span>
        Страница {page} из {totalPages}
      </span>
      <button disabled={nextDisabled} onClick={() => onChange(page + 1)}>
        Вперёд
      </button>
    </div>
  );
}
