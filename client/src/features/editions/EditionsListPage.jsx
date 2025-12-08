import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchEditions, deleteEdition } from './editionsSlice';
import Loader from '../../components/Loader';
import ErrorAlert from '../../components/ErrorAlert';
import Pagination from '../../components/Pagination';

export default function EditionsListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { list, meta, loadingList, listError, saveError } = useSelector(
    state => state.editions
  );

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    dispatch(
      fetchEditions({
        page,
        limit: 10,
        sort: 'title',
        ...(search ? { search } : {}),
        ...(type ? { type } : {})
      })
    );
  }, [dispatch, searchParams, search, type]);

  const handlePageChange = newPage => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.set('page', newPage);
      if (search) p.set('search', search);
      if (type) p.set('type', type);
      return p;
    });
  };

  const handleDelete = async id => {
    const confirmed = window.confirm('Удалить издание?');
    if (!confirmed) return;
    await dispatch(deleteEdition(id));
    // при невозможности удаления (409) saveError будет показан
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    const p = new URLSearchParams();
    p.set('page', '1');
    if (search) p.set('search', search);
    if (type) p.set('type', type);
    setSearchParams(p);
  };

  return (
    <div>
      <h1>Издания</h1>

      <ErrorAlert message={listError || saveError} />

      <form
        onSubmit={handleFilterSubmit}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}
      >
        <input
          type="text"
          placeholder="Поиск по названию/индексу"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: '1 1 200px' }}
        />
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          style={{ flex: '0 0 150px' }}
        >
          <option value="">Все виды</option>
          <option value="газета">Газеты</option>
          <option value="журнал">Журналы</option>
        </select>
        <button type="submit">Применить</button>
        <button type="button" onClick={() => navigate('/editions/new')}>
          Добавить издание
        </button>
      </form>

      {loadingList ? (
        <Loader />
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: 600
              }}
            >
              <thead>
                <tr>
                  <th>Фото</th>
                  <th>Индекс</th>
                  <th>Вид</th>
                  <th>Название</th>
                  <th>Цена/мес</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {list.map(item => (
                  <tr key={item._id}>
                    <td>
                      {item.photoUrl && (
                        <img
                          src={item.photoUrl}
                          alt={item.title}
                          style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                      )}
                    </td>
                    <td>{item.index}</td>
                    <td>{item.type}</td>
                    <td>
                      <Link to={`/editions/${item._id}`}>{item.title}</Link>
                    </td>
                    <td>{item.monthlyPrice}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => navigate(`/editions/${item._id}/edit`)}
                      >
                        Редактировать
                      </button>
                      <button type="button" onClick={() => handleDelete(item._id)}>
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
