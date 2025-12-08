import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchEditionById } from './editionsSlice';
import Loader from '../../components/Loader';
import ErrorAlert from '../../components/ErrorAlert';

export default function EditionDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loadingCurrent, currentError } = useSelector(
    state => state.editions
  );

  useEffect(() => {
    dispatch(fetchEditionById(id));
  }, [dispatch, id]);

  if (loadingCurrent) return <Loader />;

  if (currentError)
    return (
      <div>
        <ErrorAlert message={currentError} />
        <Link to="/editions">Назад к списку</Link>
      </div>
    );

  if (!current) return null;

  return (
    <div>
      <h1>{current.title}</h1>
      {current.photoUrl && (
        <img
          src={current.photoUrl}
          alt={current.title}
          style={{ width: 200, height: 200, objectFit: 'cover' }}
        />
      )}
      <p>
        <strong>Индекс:</strong> {current.index}
      </p>
      <p>
        <strong>Вид:</strong> {current.type}
      </p>
      <p>
        <strong>Цена за 1 месяц:</strong> {current.monthlyPrice} руб.
      </p>
      <Link to="/editions">Назад к списку</Link>
    </div>
  );
}
