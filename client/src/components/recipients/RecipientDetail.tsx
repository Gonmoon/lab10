import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchRecipient } from '../../features/recipients/recipientsSlice';
import PhotoModal from '../common/PhotoModal';
import LoadingSpinner from '../common/LoadingSpinner';

const RecipientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedRecipient, loading, error } = useSelector(
    (state: RootState) => state.recipients
  );

  const [showPhotoModal, setShowPhotoModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchRecipient(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !selectedRecipient) {
    return (
      <div className="alert alert-danger">
        <p>Ошибка: {error || 'Получатель не найден'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/recipients')}>
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
            <h1>{selectedRecipient.fullName}</h1>
            <p className="detail-meta">
              Код: {selectedRecipient.code} |
              Создано: {new Date(selectedRecipient.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
          <div className="detail-actions">
            <Link
              to={`/recipients/${selectedRecipient._id}/edit`}
              className="btn btn-edit"
            >
              Редактировать
            </Link>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/recipients')}
            >
              Назад к списку
            </button>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-grid">
            <div>
              <div className="detail-field">
                <div className="detail-label">Код получателя:</div>
                <div className="detail-value">{selectedRecipient.code}</div>
              </div>
              <div className="detail-field">
                <div className="detail-label">ФИО:</div>
                <div className="detail-value">{selectedRecipient.fullName}</div>
              </div>
              <div className="detail-field">
                <div className="detail-label">Адрес:</div>
                <div className="detail-value">
                  ул. {selectedRecipient.street}, д. {selectedRecipient.house}, кв. {selectedRecipient.apartment}
                </div>
              </div>
            </div>

            <div>
              <div className="detail-field">
                <div className="detail-label">Дата создания:</div>
                <div className="detail-value">
                  {new Date(selectedRecipient.createdAt).toLocaleString('ru-RU')}
                </div>
              </div>
              <div className="detail-field">
                <div className="detail-label">Дата обновления:</div>
                <div className="detail-value">
                  {new Date(selectedRecipient.updatedAt).toLocaleString('ru-RU')}
                </div>
              </div>
            </div>
          </div>

          {selectedRecipient.photoUrl && (
            <div className="form-group">
              <label className="form-label">Фотография:</label>
              <div>
                <img
                  src={selectedRecipient.photoUrl}
                  alt={selectedRecipient.fullName}
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
        photoUrl={selectedRecipient.photoUrl}
        alt={selectedRecipient.fullName}
        onClose={() => setShowPhotoModal(false)}
      />
    </>
  );
};

export default RecipientDetail;