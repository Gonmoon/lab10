import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { recipientSchema } from '../../utils/validationSchemas';
import { RecipientFormData } from '../../api/recipientsApi';

interface RecipientFormProps {
  initialValues?: RecipientFormData;
  onSubmit: (values: RecipientFormData) => Promise<boolean>;
  isSubmitting: boolean;
  title: string;
}

const defaultValues: RecipientFormData = {
  code: '',
  fullName: '',
  street: '',
  house: '',
  apartment: '',
  photoUrl: '',
};

const RecipientForm: React.FC<RecipientFormProps> = ({
  initialValues = defaultValues,
  onSubmit,
  isSubmitting,
  title,
}) => {
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialValues.photoUrl || null
  );

  const handleSubmit = async (values: RecipientFormData) => {
    const success = await onSubmit(values);
    if (success) {
      navigate('/recipients');
    }
  };

  return (
    <div className="form-container">
      <h1>{title}</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={recipientSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="code" className="form-label">
                Код получателя *
              </label>
              <Field
                type="text"
                id="code"
                name="code"
                className={`form-control ${
                  errors.code && touched.code ? 'is-invalid' : ''
                }`}
                placeholder="Введите уникальный код"
              />
              <ErrorMessage
                name="code"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                ФИО получателя *
              </label>
              <Field
                type="text"
                id="fullName"
                name="fullName"
                className={`form-control ${
                  errors.fullName && touched.fullName ? 'is-invalid' : ''
                }`}
                placeholder="Введите полное имя"
              />
              <ErrorMessage
                name="fullName"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="form-group">
              <label htmlFor="street" className="form-label">
                Улица *
              </label>
              <Field
                type="text"
                id="street"
                name="street"
                className={`form-control ${
                  errors.street && touched.street ? 'is-invalid' : ''
                }`}
                placeholder="Введите название улицы"
              />
              <ErrorMessage
                name="street"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col">
                  <label htmlFor="house" className="form-label">
                    Дом *
                  </label>
                  <Field
                    type="text"
                    id="house"
                    name="house"
                    className={`form-control ${
                      errors.house && touched.house ? 'is-invalid' : ''
                    }`}
                    placeholder="Номер дома"
                  />
                  <ErrorMessage
                    name="house"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="col">
                  <label htmlFor="apartment" className="form-label">
                    Квартира *
                  </label>
                  <Field
                    type="text"
                    id="apartment"
                    name="apartment"
                    className={`form-control ${
                      errors.apartment && touched.apartment ? 'is-invalid' : ''
                    }`}
                    placeholder="Номер квартиры"
                  />
                  <ErrorMessage
                    name="apartment"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
              </div>
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
                  if (url && recipientSchema.fields.photoUrl.isValidSync(url)) {
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
                onClick={() => navigate('/recipients')}
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

export default RecipientForm;