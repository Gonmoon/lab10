import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createEdition,
  updateEdition,
  fetchEditionById
} from './editionsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import ErrorAlert from '../../components/ErrorAlert';

export default function EditionFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { current, loadingCurrent, saving, saveError } = useSelector(
    state => state.editions
  );

  const [form, setForm] = useState({
    index: '',
    type: 'газета',
    title: '',
    monthlyPrice: '',
    photoUrl: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchEditionById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && current) {
      setForm({
        index: current.index,
        type: current.type,
        title: current.title,
        monthlyPrice: String(current.monthlyPrice),
        photoUrl: current.photoUrl || ''
      });
    }
  }, [current, isEdit]);

  const validate = () => {
    const errors = {};
    if (!form.index.trim()) errors.index = 'Индекс обязателен';
    if (!/^[0-9]{5,8}$/.test(form.index.trim())) errors.index = '5–8 цифр';
    if (!form.title.trim()) errors.title = 'Название обязательно';
    if (!form.monthlyPrice || Number(form.monthlyPrice) <= 0) {
      errors.monthlyPrice = 'Цена должна быть > 0';
    }
    if (form.photoUrl && !/^https?:\/\/.+/i.test(form.photoUrl)) {
      errors.photoUrl = 'Неверный URL';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      index: form.index.trim(),
      type: form.type,
      title: form.title.trim(),
      monthlyPrice: Number(form.monthlyPrice),
      photoUrl: form.photoUrl.trim()
    };

    if (isEdit) {
      const result = await dispatch(updateEdition({ id, payload }));
      if (!result.error) navigate('/editions');
    } else {
      const result = await dispatch(createEdition(payload));
      if (!result.error) navigate('/editions');
    }
  };

  if (isEdit && loadingCurrent) return <Loader />;

  return (
    <div>
      <h1>{isEdit ? 'Редактировать издание' : 'Новое издание'}</h1>
      <ErrorAlert message={saveError} />

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: 400
        }}
      >
        <label>
          Индекс
          <input
            name="index"
            value={form.index}
            onChange={handleChange}
            disabled={isEdit}
          />
          {formErrors.index && (
            <div style={{ color: 'red', fontSize: 12 }}>{formErrors.index}</div>
          )}
        </label>

        <label>
          Вид издания
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="газета">Газета</option>
            <option value="журнал">Журнал</option>
          </select>
        </label>

        <label>
          Название
          <input name="title" value={form.title} onChange={handleChange} />
          {formErrors.title && (
            <div style={{ color: 'red', fontSize: 12 }}>{formErrors.title}</div>
          )}
        </label>

        <label>
          Цена за 1 месяц (руб.)
          <input
            name="monthlyPrice"
            type="number"
            min="0"
            step="0.01"
            value={form.monthlyPrice}
            onChange={handleChange}
          />
          {formErrors.monthlyPrice && (
            <div style={{ color: 'red', fontSize: 12 }}>
              {formErrors.monthlyPrice}
            </div>
          )}
        </label>

        <label>
          Фото (URL)
          <input name="photoUrl" value={form.photoUrl} onChange={handleChange} />
          {formErrors.photoUrl && (
            <div style={{ color: 'red', fontSize: 12 }}>{formErrors.photoUrl}</div>
          )}
        </label>

        <button type="submit" disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}
