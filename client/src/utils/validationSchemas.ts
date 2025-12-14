import * as Yup from 'yup';

export const editionSchema = Yup.object({
  index: Yup.string()
    .matches(/^[0-9]{5,8}$/, 'Индекс должен быть числом длиной 5-8 символов')
    .required('Обязательное поле'),
  type: Yup.string()
    .oneOf(['газета', 'журнал'], 'Выберите тип издания')
    .required('Обязательное поле'),
  title: Yup.string()
    .min(2, 'Название должно быть не короче 2 символов')
    .max(200, 'Название не должно превышать 200 символов')
    .required('Обязательное поле'),
  monthlyPrice: Yup.number()
    .min(0, 'Стоимость не может быть отрицательной')
    .max(1000000, 'Стоимость слишком большая')
    .required('Обязательное поле'),
  photoUrl: Yup.string()
    .url('Введите корректный URL')
    .nullable()
    .transform((value) => value === '' ? null : value),
});

export const recipientSchema = Yup.object({
  code: Yup.string()
    .min(1, 'Код должен содержать хотя бы 1 символ')
    .max(50, 'Код не должен превышать 50 символов')
    .required('Обязательное поле'),
  fullName: Yup.string()
    .min(3, 'ФИО должно быть не короче 3 символов')
    .max(200, 'ФИО не должно превышать 200 символов')
    .required('Обязательное поле'),
  street: Yup.string()
    .min(2, 'Улица должна быть не короче 2 символов')
    .max(100, 'Улица не должна превышать 100 символов')
    .required('Обязательное поле'),
  house: Yup.string()
    .min(1, 'Дом должен содержать хотя бы 1 символ')
    .max(10, 'Дом не должен превышать 10 символов')
    .required('Обязательное поле'),
  apartment: Yup.string()
    .min(1, 'Квартира должна содержать хотя бы 1 символ')
    .max(10, 'Квартира не должна превышать 10 символов')
    .required('Обязательное поле'),
  photoUrl: Yup.string()
    .url('Введите корректный URL')
    .nullable()
    .transform((value) => value === '' ? null : value),
});

export const subscriptionSchema = Yup.object({
  recipient: Yup.string()
    .required('Выберите получателя'),
  edition: Yup.string()
    .required('Выберите издание'),
  months: Yup.number()
    .oneOf([1, 3, 6], 'Срок подписки может быть 1, 3 или 6 месяцев')
    .required('Обязательное поле'),
  startMonth: Yup.number()
    .min(1, 'Месяц должен быть от 1 до 12')
    .max(12, 'Месяц должен быть от 1 до 12')
    .required('Обязательное поле'),
  startYear: Yup.number()
    .min(2000, 'Год должен быть не ранее 2000')
    .max(new Date().getFullYear() + 5, `Год должен быть не позднее ${new Date().getFullYear() + 5}`)
    .required('Обязательное поле'),
});