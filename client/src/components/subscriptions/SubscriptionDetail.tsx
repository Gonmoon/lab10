import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchSubscription } from '../../features/subscriptions/subscriptionsSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { getMonthName, calculateTotalPrice } from '../../utils/formatters';

const SubscriptionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSubscription, loading, error } = useSelector(
    (state: RootState) => state.subscriptions
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchSubscription(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !selectedSubscription) {
    return (
      <div className="alert alert-danger">
        <p>Ошибка: {error || 'Подписка не найдена'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/subscriptions')}>
          Вернуться к списку
        </button>
      </div>
    );
  }

  const calculateEndDate = () => {
    const endMonth = selectedSubscription.startMonth + selectedSubscription.months - 1;
    let endYear = selectedSubscription.startYear;
    let finalMonth = endMonth % 12;
    if (finalMonth === 0) {
      finalMonth = 12;
      endYear += Math.floor((endMonth - 1) / 12);
    } else {
      endYear += Math.floor(endMonth / 12);
    }
    return { month: finalMonth, year: endYear };
  };

  const endDate = calculateEndDate();
  const totalPrice = calculateTotalPrice(
    selectedSubscription.edition.monthlyPrice,
    selectedSubscription.months
  );

  return (
    <div className="detail-card">
      <div className="detail-header">
        <div>
          <h1>Подписка #{selectedSubscription._id.slice(-6)}</h1>
          <p className="detail-meta">
            Создано: {new Date(selectedSubscription.createdAt).toLocaleDateString('ru-RU')} |
            Срок: {selectedSubscription.months} мес.
          </p>
        </div>
        <div className="detail-actions">
          <Link
            to={`/subscriptions/${selectedSubscription._id}/edit`}
            className="btn btn-edit"
          >
            Редактировать
          </Link>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/subscriptions')}
          >
            Назад к списку
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-grid">
          <div className="card">
            <h3>Информация о подписке</h3>
            <div className="detail-field">
              <div className="detail-label">Период:</div>
              <div className="detail-value">
                {getMonthName(selectedSubscription.startMonth)} {selectedSubscription.startYear} -{' '}
                {getMonthName(endDate.month)} {endDate.year}
              </div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Срок подписки:</div>
              <div className="detail-value">{selectedSubscription.months} месяцев</div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Дата начала:</div>
              <div className="detail-value">
                {getMonthName(selectedSubscription.startMonth)} {selectedSubscription.startYear}
              </div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Дата окончания:</div>
              <div className="detail-value">
                {getMonthName(endDate.month)} {endDate.year}
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Финансовая информация</h3>
            <div className="detail-field">
              <div className="detail-label">Стоимость в месяц:</div>
              <div className="detail-value">
                {selectedSubscription.edition.monthlyPrice.toFixed(2)} руб.
              </div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Общая стоимость:</div>
              <div className="detail-value text-success" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                {totalPrice.toFixed(2)} руб.
              </div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Дата создания:</div>
              <div className="detail-value">
                {new Date(selectedSubscription.createdAt).toLocaleString('ru-RU')}
              </div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Дата обновления:</div>
              <div className="detail-value">
                {new Date(selectedSubscription.updatedAt).toLocaleString('ru-RU')}
              </div>
            </div>
          </div>
        </div>

        <div className="detail-grid">
          <div className="card">
            <h3>Информация о получателе</h3>
            <div className="detail-field">
              <div className="detail-label">Код:</div>
              <div className="detail-value">
                <Link to={`/recipients/${selectedSubscription.recipient._id}`}>
                  {selectedSubscription.recipient.code}
                </Link>
              </div>
            </div>
            <div className="detail-field">
              <div className="detail-label">ФИО:</div>
              <div className="detail-value">
                <Link to={`/recipients/${selectedSubscription.recipient._id}`}>
                  {selectedSubscription.recipient.fullName}
                </Link>
              </div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Адрес:</div>
              <div className="detail-value">
                ул. {selectedSubscription.recipient.street}, д. {selectedSubscription.recipient.house}, кв. {selectedSubscription.recipient.apartment}
              </div>
            </div>
            {selectedSubscription.recipient.photoUrl && (
              <div className="detail-field">
                <div className="detail-label">Фото:</div>
                <div className="detail-value">
                  <img
                    src={selectedSubscription.recipient.photoUrl}
                    alt={selectedSubscription.recipient.fullName}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3>Информация об издании</h3>
            <div className="detail-field">
              <div className="detail-label">Название:</div>
              <div className="detail-value">
                <Link to={`/editions/${selectedSubscription.edition._id}`}>
                  {selectedSubscription.edition.title}
                </Link>
              </div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Индекс:</div>
              <div className="detail-value">{selectedSubscription.edition.index}</div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Тип:</div>
              <div className="detail-value">{selectedSubscription.edition.type}</div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Стоимость/мес:</div>
              <div className="detail-value">
                {selectedSubscription.edition.monthlyPrice.toFixed(2)} руб.
              </div>
            </div>
            {selectedSubscription.edition.photoUrl && (
              <div className="detail-field">
                <div className="detail-label">Обложка:</div>
                <div className="detail-value">
                  <img
                    src={selectedSubscription.edition.photoUrl}
                    alt={selectedSubscription.edition.title}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetail;