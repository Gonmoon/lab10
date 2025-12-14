import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchEdition } from '../../features/editions/editionsSlice';
import PhotoModal from '../common/PhotoModal';
import LoadingSpinner from '../common/LoadingSpinner';

const EditionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedEdition, loading, error } = useSelector(
    (state: RootState) => state.editions
  );

  const [showPhotoModal, setShowPhotoModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchEdition(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !selectedEdition) {
    return (
      <div className="alert alert-danger">
        <p>Ошибка: {error || 'Издание не найдено'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/editions')}>
          Вернуться к списку
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="detail-card">
        <div className="detail-header">
          <div>
            <h1>{selectedEdition.title}</h1>
            <p className="detail-meta">
              Индекс: {selectedEdition.index} | Тип: {selectedEdition.type} |
              Создано: {new Date(selectedEdition.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
          <div className="detail-actions">
            <Link
              to={`/editions/${selectedEdition._id}/edit`}
              className="btn btn-edit"
            >
              Редактировать
            </Link>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/editions')}
            >
              Назад к списку
            </button>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-grid">
            <div>
              <div className="detail-field">
                <div className="detail-label">Индекс издания:</div>
                <div className="detail-value">{selectedEdition.index}</div>
              </div>
              <div className="detail-field">
                <div className="detail-label">Тип издания:</div>
                <div className="detail-value">{selectedEdition.type}</div>
              </div>
              <div className="detail-field">
                <div className="detail-label">Название:</div>
                <div className="detail-value">{selectedEdition.title}</div>
              </div>
            </div>

            <div>
              <div className="detail-field">
                <div className="detail-label">Стоимость подписки на месяц:</div>
                <div className="detail-value">
                  {selectedEdition.monthlyPrice.toFixed(2)} руб.
                </div>
              </div>
              <div className="detail-field">
                <div className="detail-label">Дата создания:</div>
                <div className="detail-value">
                  {new Date(selectedEdition.createdAt).toLocaleString('ru-RU')}
                </div>
              </div>
              <div className="detail-field">
                <div className="detail-label">Дата обновления:</div>
                <div className="detail-value">
                  {new Date(selectedEdition.updatedAt).toLocaleString('ru-RU')}
                </div>
              </div>
            </div>
          </div>

          {selectedEdition.photoUrl && (
            <div className="form-group">
              <label className="form-label">Фотография:</label>
              <div>
                <img
                  src={selectedEdition.photoUrl}
                  alt={selectedEdition.title}
                  className="detail-photo"
                  style={{ cursor: 'pointer', maxWidth: '300px' }}
                  onClick={() => setShowPhotoModal(true)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <p>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setShowPhotoModal(true)}
                  >
                    Увеличить
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <PhotoModal
        isOpen={showPhotoModal}
        photoUrl={selectedEdition.photoUrl}
        alt={selectedEdition.title}
        onClose={() => setShowPhotoModal(false)}
      />
    </>
  );
};

export default EditionDetail;