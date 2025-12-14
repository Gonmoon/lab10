import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchRecipients, deleteRecipient } from '../../features/recipients/recipientsSlice';
import ConfirmationModal from '../common/ConfirmationModal';
import PhotoModal from '../common/PhotoModal';
import Pagination from '../common/Pagination';

const RecipientList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading, error, pagination } = useSelector(
    (state: RootState) => state.recipients
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  useEffect(() => {
    loadRecipients();
  }, [pagination.page, searchTerm, sortBy]);

  const loadRecipients = () => {
    dispatch(
      fetchRecipients({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        sort: sortBy,
      })
    );
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await dispatch(deleteRecipient(deleteId)).unwrap();
      } catch (err: any) {
        if (err.includes('есть подписки')) {
          alert('Нельзя удалить получателя: у него есть подписки');
        } else {
          alert(err || 'Ошибка при удалении получателя');
        }
      } finally {
        setDeleteId(null);
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchRecipients({ page }));
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Загрузка получателей...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <p>Ошибка: {error}</p>
        <button className="btn btn-primary" onClick={loadRecipients}>
          Повторить
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="header">
        <h1>Получатели</h1>
        <Link to="/recipients/new" className="btn btn-primary">
          + Добавить получателя
        </Link>
      </div>

      <div className="filters-container">
        <div className="form-group">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Поиск по ФИО, коду или адресу..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="form-group">
          <select
            className="form-control filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Сначала новые</option>
            <option value="-createdAt">Сначала старые</option>
            <option value="fullName">ФИО А-Я</option>
            <option value="-fullName">ФИО Я-А</option>
            <option value="code">Код ↑</option>
            <option value="-code">Код ↓</option>
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <h3>Получатели не найдены</h3>
          <p>Начните с добавления первого получателя</p>
          <Link to="/recipients/new" className="btn btn-primary">
            Добавить получателя
          </Link>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Код</th>
                  <th>ФИО</th>
                  <th>Адрес</th>
                  <th>Фото</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {items.map((recipient) => (
                  <tr key={recipient._id}>
                    <td>{recipient.code}</td>
                    <td>
                      <Link to={`/recipients/${recipient._id}`}>
                        {recipient.fullName}
                      </Link>
                    </td>
                    <td>
                      ул. {recipient.street}, д. {recipient.house}, кв. {recipient.apartment}
                    </td>
                    <td>
                      {recipient.photoUrl ? (
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setPhotoUrl(recipient.photoUrl);
                            setShowPhotoModal(true);
                          }}
                        >
                          Просмотр
                        </button>
                      ) : (
                        <span className="text-muted">Нет</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/recipients/${recipient._id}/edit`}
                          className="btn btn-sm btn-edit"
                        >
                          Редактировать
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => setDeleteId(recipient._id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <ConfirmationModal
        isOpen={!!deleteId}
        title="Удаление получателя"
        message="Вы уверены, что хотите удалить этого получателя? Все связанные подписки также будут удалены."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <PhotoModal
        isOpen={showPhotoModal}
        photoUrl={photoUrl || ''}
        alt="Фото получателя"
        onClose={() => setShowPhotoModal(false)}
      />
    </>
  );
};

export default RecipientList;