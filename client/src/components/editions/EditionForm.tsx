import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { editionSchema } from '../../utils/validationSchemas';
import { EditionFormData } from '../../api/editionsApi';

interface EditionFormProps {
  initialValues?: EditionFormData;
  onSubmit: (values: EditionFormData) => Promise<boolean>;
  isSubmitting: boolean;
  title: string;
}

const defaultValues: EditionFormData = {
  index: '',
  type: 'газета',
  title: '',
  monthlyPrice: 0,
  photoUrl: '',
};

const EditionForm: React.FC<EditionFormProps> = ({
  initialValues = defaultValues,
  onSubmit,
  isSubmitting,
  title,
}) => {
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialValues.photoUrl || null
  );

  const handleSubmit = async (values: EditionFormData) => {
    const success = await onSubmit(values);
    if (success) {
      navigate('/editions');
    }
  };

  return (
    <div className="form-container">
      <h1>{title}</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={editionSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="index" className="form-label">
                Индекс издания *
              </label>
              <Field
                type="text"
                id="index"
                name="index"
                className={`form-control ${
                  errors.index && touched.index ? 'is-invalid' : ''
                }`}
                placeholder="Например: 12345"
              />
              <ErrorMessage
                name="index"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="form-group">
              <label htmlFor="type" className="form-label">
                Тип издания *
              </label>
              <Field
                as="select"
                id="type"
                name="type"
                className={`form-control ${
                  errors.type && touched.type ? 'is-invalid' : ''
                }`}
              >
                <option value="газета">Газета</option>
                <option value="журнал">Журнал</option>
              </Field>
              <ErrorMessage
                name="type"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Название *
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                className={`form-control ${
                  errors.title && touched.title ? 'is-invalid' : ''
                }`}
                placeholder="Введите название издания"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="form-group">
              <label htmlFor="monthlyPrice" className="form-label">
                Стоимость подписки на месяц (руб.) *
              </label>
              <Field
                type="number"
                id="monthlyPrice"
                name="monthlyPrice"
                min="0"
                step="0.01"
                className={`form-control ${
                  errors.monthlyPrice && touched.monthlyPrice ? 'is-invalid' : ''
                }`}
              />
              <ErrorMessage
                name="monthlyPrice"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="form-group">
              <label htmlFor="photoUrl" className="form-label">
                URL фотографии
              </label>
              <Field
                type="text"
                id="photoUrl"
                name="photoUrl"
                className={`form-control ${
                  errors.photoUrl && touched.photoUrl ? 'is-invalid' : ''
                }`}
                placeholder="https://example.com/photo.jpg"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const url = e.target.value;
                  if (url && Yup.string().url().isValidSync(url)) {
                    setPhotoPreview(url);
                  } else {
                    setPhotoPreview(null);
                  }
                }}
              />
              <ErrorMessage
                name="photoUrl"
                component="div"
                className="invalid-feedback"
              />
            </div>

            {photoPreview && (
              <div className="form-group">
                <label className="form-label">Предпросмотр фотографии:</label>
                <div>
                  <img
                    src={photoPreview}
                    alt="Предпросмотр"
                    className="detail-photo"
                    style={{ maxWidth: '200px' }}
                    onError={() => setPhotoPreview(null)}
                  />
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
                onClick={() => navigate('/editions')}
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

export default EditionForm;