import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchSubscriptions, deleteSubscription } from '../../features/subscriptions/subscriptionsSlice';
import ConfirmationModal from '../common/ConfirmationModal';
import Pagination from '../common/Pagination';
import { getMonthName } from '../../utils/formatters';

const SubscriptionList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading, error, pagination } = useSelector(
    (state: RootState) => state.subscriptions
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [monthsFilter, setMonthsFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, [pagination.page, searchTerm, monthsFilter, yearFilter, monthFilter, sortBy]);

  const loadSubscriptions = () => {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
      sort: sortBy,
    };

    if (searchTerm) {
      params.search = searchTerm;
    }
    if (monthsFilter) {
      params.months = monthsFilter;
    }
    if (yearFilter) {
      params.startYear = yearFilter;
    }
    if (monthFilter) {
      params.startMonth = monthFilter;
    }

    dispatch(fetchSubscriptions(params));
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await dispatch(deleteSubscription(deleteId)).unwrap();
      } catch (err: any) {
        alert(err || 'Ошибка при удалении подписки');
      } finally {
        setDeleteId(null);
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchSubscriptions({ page }));
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear + 5; year >= 2000; year--) {
      years.push(year);
    }
    return years;
  };

  const getMonths = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Загрузка подписок...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <p>Ошибка: {error}</p>
        <button className="btn btn-primary" onClick={loadSubscriptions}>
          Повторить
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="header">
        <h1>Подписки</h1>
        <Link to="/subscriptions/new" className="btn btn-primary">
          + Добавить подписку
        </Link>
      </div>

      <div className="filters-container">
        <div className="form-group">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Поиск по получателю или изданию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="form-group">
          <select
            className="form-control filter-select"
            value={monthsFilter}
            onChange={(e) => setMonthsFilter(e.target.value)}
          >
            <option value="">Все сроки</option>
            <option value="1">1 месяц</option>
            <option value="3">3 месяца</option>
            <option value="6">6 месяцев</option>
          </select>
        </div>

        <div className="form-group">
          <select
            className="form-control filter-select"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">Все годы</option>
            {getYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <select
            className="form-control filter-select"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="">Все месяцы</option>
            {getMonths().map((month) => (
              <option key={month} value={month}>
                {getMonthName(month)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <select
            className="form-control filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Сначала новые</option>
            <option value="-createdAt">Сначала старые</option>
            <option value="startYear">Год ↑</option>
            <option value="-startYear">Год ↓</option>
            <option value="months">Срок ↑</option>
            <option value="-months">Срок ↓</option>
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>Подписки не найдены</h3>
          <p>Начните с добавления первой подписки</p>
          <Link to="/subscriptions/new" className="btn btn-primary">
            Добавить подписку
          </Link>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Получатель</th>
                  <th>Издание</th>
                  <th>Период</th>
                  <th>Срок</th>
                  <th>Общая стоимость</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {items.map((subscription) => (
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
                      {getMonthName(subscription.startMonth)} {subscription.startYear}
                    </td>
                    <td>{subscription.months} мес.</td>
                    <td>
                      {(subscription.edition.monthlyPrice * subscription.months).toFixed(2)} руб.
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/subscriptions/${subscription._id}`}
                          className="btn btn-sm btn-edit"
                        >
                          Просмотр
                        </Link>
                        <Link
                          to={`/subscriptions/${subscription._id}/edit`}
                          className="btn btn-sm btn-warning"
                        >
                          Редактировать
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => setDeleteId(subscription._id)}
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
        title="Удаление подписки"
        message="Вы уверены, что хотите удалить эту подписку? Это действие нельзя отменить."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
};

export default SubscriptionList;