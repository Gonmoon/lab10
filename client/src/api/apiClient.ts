import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Ошибка с ответом от сервера
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          error.message = data.message || 'Некорректный запрос';
          break;
        case 401:
          error.message = 'Требуется авторизация';
          break;
        case 403:
          error.message = 'Доступ запрещен';
          break;
        case 404:
          error.message = 'Ресурс не найден';
          break;
        case 409:
          error.message = data.message || 'Конфликт данных';
          break;
        case 500:
          error.message = 'Внутренняя ошибка сервера';
          break;
        default:
          error.message = `Ошибка ${status}`;
      }
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      error.message = 'Не удалось получить ответ от сервера. Проверьте подключение к сети.';
    } else {
      // Ошибка при настройке запроса
      error.message = 'Ошибка при отправке запроса';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;