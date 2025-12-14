import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { subscriptionSchema } from '../../utils/validationSchemas';
import { SubscriptionFormData } from '../../api/subscriptionsApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getMonthName } from '../../utils/formatters';

interface SubscriptionFormProps {
  initialValues?: SubscriptionFormData;
  onSubmit: (values: SubscriptionFormData) => Promise<boolean>;
  isSubmitting: boolean;
  title: string;
}

const defaultValues: SubscriptionFormData = {
  recipient: '',
  edition: '',
  months: 1,
  startMonth: new Date().getMonth() + 1,
  startYear: new Date().getFullYear(),
};

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  initialValues = defaultValues,
  onSubmit,
  isSubmitting,
  title,
}) => {
  const navigate = useNavigate();
  const { items: recipients } = useSelector((state: RootState) => state.recipients);
  const { items: editions } = useSelector((state: RootState) => state.editions);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (initialValues.edition) {
      const selectedEdition = editions.find(e => e._id === initialValues.edition);
      if (selectedEdition) {
        setTotalPrice(selectedEdition.monthlyPrice * initialValues.months);
      }
    }
  }, [initialValues.edition, initialValues.months, editions]);

  const handleSubmit = async (values: SubscriptionFormData) => {
    const success = await onSubmit(values);
    if (success) {
      navigate('/subscriptions');
    }
  };

  const handleEditionChange = (editionId: string, months: number) => {
    const selectedEdition = editions.find(e => e._id === editionId);
    if (selectedEdition) {
      setTotalPrice(selectedEdition.monthlyPrice * months);
    }
  };

  const handleMonthsChange = (editionId: string, months: number) => {
    const selectedEdition = editions.find(e => e._id === editionId);
    if (selectedEdition) {
      setTotalPrice(selectedEdition.monthlyPrice * months);
    }
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year <= currentYear + 5; year++) {
      years.push(year);
    }
    return years;
  };

  const getMonths = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  return (
    <div className="form-container">
      <h1>{title}</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={subscriptionSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="recipient" className="form-label">
                Получатель *
              </label>
              <Field
                as="select"
                id="recipient"
                name="recipient"
                className={`form-control ${
                  errors.recipient && touched.recipient ? 'is-invalid' : ''
                }`}
              >
                <option value="">Выберите получателя</option>
                {recipients.map((recipient) => (
                  <option key={recipient._id} value={recipient._id}>
                    {recipient.fullName} ({recipient.code})
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="recipient"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edition" className="form-label">
                Издание *
              </label>
              <Field
                as="select"
                id="edition"
                name="edition"
                className={`form-control ${
                  errors.edition && touched.edition ? 'is-invalid' : ''
                }`}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setFieldValue('edition', e.target.value);
                  handleEditionChange(e.target.value, values.months);
                }}
              >
                <option value="">Выберите издание</option>
                {editions.map((edition) => (
                  <option key={edition._id} value={edition._id}>
                    {edition.title} ({edition.type}, {edition.monthlyPrice.toFixed(2)} руб./мес.)
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="edition"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="form-group">
              <label htmlFor="months" className="form-label">
                Срок подписки *
              </label>
              <Field
                as="select"
                id="months"
                name="months"
                className={`form-control ${
                  errors.months && touched.months ? 'is-invalid' : ''
                }`}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const months = parseInt(e.target.value);
                  setFieldValue('months', months);
                  handleMonthsChange(values.edition, months);
                }}
              >
                <option value="1">1 месяц</option>
                <option value="3">3 месяца</option>
                <option value="6">6 месяцев</option>
              </Field>
              <ErrorMessage
                name="months"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="form-group">
              <label htmlFor="startYear" className="form-label">
                Год начала доставки *
              </label>
              <Field
                as="select"
                id="startYear"
                name="startYear"
                className={`form-control ${
                  errors.startYear && touched.startYear ? 'is-invalid' : ''
                }`}
              >
                {getYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="startYear"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="form-group">
              <label htmlFor="startMonth" className="form-label">
                Месяц начала доставки *
              </label>
              <Field
                as="select"
                id="startMonth"
                name="startMonth"
                className={`form-control ${
                  errors.startMonth && touched.startMonth ? 'is-invalid' : ''
                }`}
              >
                {getMonths().map((month) => (
                  <option key={month} value={month}>
                    {getMonthName(month)}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="startMonth"
                component="div"
                className="invalid-feedback"
              />
            </div>

            {values.edition && (
              <div className="form-group">
                <div className="card">
                  <h3>Сводка</h3>
                  <p>
                    <strong>Общая стоимость:</strong>{' '}
                    <span className="text-success">{totalPrice.toFixed(2)} руб.</span>
                  </p>
                  <p>
                    <strong>Период подписки:</strong>{' '}
                    {getMonthName(values.startMonth)} {values.startYear} -{' '}
                    {(() => {
                      const endDate = new Date(values.startYear, values.startMonth - 1 + values.months, 0);
                      return `${getMonthName(endDate.getMonth() + 1)} ${endDate.getFullYear()}`;
                    })()}
                  </p>
                  <p>
                    <strong>Стоимость в месяц:</strong>{' '}
                    {editions.find(e => e._id === values.edition)?.monthlyPrice.toFixed(2)} руб.
                  </p>
                </div>
              </div>
            )}

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/subscriptions')}
                style={{ marginLeft: '1rem' }}
              >
                Отмена
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SubscriptionForm;