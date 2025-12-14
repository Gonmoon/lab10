export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'BYN',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getMonthName = (month: number): string => {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  return months[month - 1] || '';
};

export const calculateTotalPrice = (monthlyPrice: number, months: number): number => {
  return monthlyPrice * months;
};

export const getSubscriptionPeriod = (startMonth: number, startYear: number, months: number): string => {
  const startDate = new Date(startYear, startMonth - 1, 1);
  const endDate = new Date(startYear, startMonth - 1 + months, 0);
  
  const startMonthName = getMonthName(startMonth);
  const endMonthName = getMonthName(endDate.getMonth() + 1);
  
  return `${startMonthName} ${startYear} - ${endMonthName} ${endDate.getFullYear()}`;
};

export const formatAddress = (street: string, house: string, apartment: string): string => {
  return `ул. ${street}, д. ${house}, кв. ${apartment}`;
};