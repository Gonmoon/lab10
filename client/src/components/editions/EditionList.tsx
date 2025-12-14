import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEditions } from '../../features/editions/editionsSlice';
import { RootState, AppDispatch } from '../../store/store';

const EditionList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, pagination, loading } = useSelector((state: RootState) => state.editions);

  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('createdAt');

  const load = (page = 1) => {
    const params: Record<string, any> = { page, limit: pagination.limit, sort };
    if (search.trim()) params.search = search.trim();
    if (type) params.type = type;
    dispatch(fetchEditions(params));
  };

  useEffect(() => { load(1); }, [search, type, sort]);

  if (loading) return <div>Загрузка…</div>;

  return (
    <div>
      <h1>Издания</h1>
      <input placeholder="Поиск" value={search} onChange={(e) => setSearch(e.target.value)} />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Все</option>
        <option value="газета">Газета</option>
        <option value="журнал">Журнал</option>
      </select>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="createdAt">Новые</option>
        <option value="-createdAt">Старые</option>
        <option value="title">Название А-Я</option>
        <option value="-title">Название Я-А</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Индекс</th>
            <th>Название</th>
            <th>Тип</th>
            <th>Цена</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e) => (
            <tr key={e._id}>
              <td>{e.index}</td>
              <td><Link to={`/editions/${e._id}`}>{e.title}</Link></td>
              <td>{e.type}</td>
              <td>{e.monthlyPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button disabled={pagination.page === 1} onClick={() => load(pagination.page - 1)}>←</button>
      <span>{pagination.page} / {pagination.totalPages}</span>
      <button disabled={pagination.page === pagination.totalPages} onClick={() => load(pagination.page + 1)}>→</button>
    </div>
  );
};

export default EditionList;
