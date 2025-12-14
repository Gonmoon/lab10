import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchEditions } from '../features/editions/editionsSlice';
import { fetchRecipients } from '../features/recipients/recipientsSlice';
import { fetchSubscriptions } from '../features/subscriptions/subscriptionsSlice';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: editions, loading: editionsLoading } = useSelector((state: RootState) => state.editions);
  const { items: recipients, loading: recipientsLoading } = useSelector((state: RootState) => state.recipients);
  const { items: subscriptions, loading: subscriptionsLoading } = useSelector((state: RootState) => state.subscriptions);

  useEffect(() => {
    dispatch(fetchEditions());
    dispatch(fetchRecipients());
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  const isLoading = editionsLoading || recipientsLoading || subscriptionsLoading;

  const stats = [
    {
      title: 'Издания',
      value: editions.length,
      icon: '📰',
      color: '#3498db',
      link: '/editions',
    },
    {
      title: 'Получатели',
      value: recipients.length,
      icon: '👤',
      color: '#2ecc71',
      link: '/recipients',
    },
    {
      title: 'Активные подписки',
      value: subscriptions.length,
      icon: '📋',
      color: '#e74c3c',
      link: '/subscriptions',
    },
    {
      title: 'Общая стоимость',
      value: `${subscriptions.reduce((total, sub) => total + (sub.edition.monthlyPrice * sub.months), 0).toFixed(2)} руб.`,
      icon: '💰',
      color: '#f39c12',
      link: '/subscriptions',
    },
  ];

  const recentSubscriptions = [...subscriptions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="header">
        <h1>Добро пожаловать в систему подписок Белпочта</h1>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.title} className="stat-card" style={{ borderLeftColor: stat.color }}>
                <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <h3>{stat.title}</h3>
                  <p className="stat-value">{stat.value}</p>
                  <Link to={stat.link} className="stat-link">
                    Подробнее →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col">
              <div className="card">
                <h2>Последние подписки</h2>
                {recentSubscriptions.length > 0 ? (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Получатель</th>
                          <th>Издание</th>
                          <th>Период</th>
                          <th>Стоимость</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSubscriptions.map((subscription) => (
                          <tr key={subscription._id}>
                            <td>
                              <Link to={`/recipients/${subscription.recipient._id}`}>
                                {subscription.recipient.fullName}
                              </Link>
                            </td>
                            <td>
                              <Link to={`/editions/${subscription.edition._id}`}>
                                {subscription.edition.title}
                              </Link>
                            </td>
                            <td>
                              {subscription.months} мес.
                            </td>
                            <td>
                              {(subscription.edition.monthlyPrice * subscription.months).toFixed(2)} руб.
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Нет активных подписок</p>
                )}
                <div className="text-center" style={{ marginTop: '1rem' }}>
                  <Link to="/subscriptions" className="btn btn-primary">
                    Все подписки
                  </Link>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card">
                <h2>Быстрые действия</h2>
                <div className="quick-actions">
                  <Link to="/editions/new" className="quick-action">
                    <div className="quick-action-icon">➕</div>
                    <div>
                      <h4>Добавить издание</h4>
                      <p>Добавьте новое издание в каталог</p>
                    </div>
                  </Link>
                  <Link to="/recipients/new" className="quick-action">
                    <div className="quick-action-icon">👤</div>
                    <div>
                      <h4>Добавить получателя</h4>
                      <p>Зарегистрируйте нового получателя</p>
                    </div>
                  </Link>
                  <Link to="/subscriptions/new" className="quick-action">
                    <div className="quick-action-icon">📋</div>
                    <div>
                      <h4>Оформить подписку</h4>
                      <p>Оформите новую подписку на издание</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;