const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Edition = require('../models/Edition');
const Recipient = require('../models/Recipient');
const Subscription = require('../models/Subscription');

const editionTitles = [
  { index: '10001', type: 'газета', title: 'Советская Белоруссия', monthlyPrice: 5.5 },
  { index: '10002', type: 'газета', title: 'Звязда', monthlyPrice: 4.2 },
  { index: '10003', type: 'газета', title: 'Комсомольская правда', monthlyPrice: 3.9 },
  { index: '20001', type: 'журнал', title: 'Наука и инновации', monthlyPrice: 7.0 },
  { index: '20002', type: 'журнал', title: 'Здоровье и жизнь', monthlyPrice: 6.2 },
  { index: '20003', type: 'журнал', title: 'Мир животных', monthlyPrice: 5.8 },
  { index: '10004', type: 'газета', title: 'Вечерний Минск', monthlyPrice: 3.2 },
  { index: '10005', type: 'газета', title: 'Республика', monthlyPrice: 4.0 },
  { index: '10006', type: 'газета', title: 'Народная газета', monthlyPrice: 3.5 },
  { index: '10007', type: 'газета', title: 'Беларусь сегодня', monthlyPrice: 4.8 },
  { index: '10008', type: 'газета', title: 'Минский курьер', monthlyPrice: 2.9 },
  { index: '10009', type: 'газета', title: 'Сельская газета', monthlyPrice: 3.1 },
  { index: '10010', type: 'газета', title: 'Вестник регионов', monthlyPrice: 3.7 },
  { index: '10011', type: 'газета', title: 'Гродненская правда', monthlyPrice: 3.4 },
  { index: '10012', type: 'газета', title: 'Витебский вестник', monthlyPrice: 3.0 },
  { index: '10013', type: 'газета', title: 'Гомельские новости', monthlyPrice: 3.3 },
  { index: '10014', type: 'газета', title: 'Брестский курьер', monthlyPrice: 2.8 },
  { index: '10015', type: 'газета', title: 'Могилевские известия', monthlyPrice: 3.2 },
  { index: '10016', type: 'газета', title: 'Спортивная панорама', monthlyPrice: 4.1 },
  { index: '10017', type: 'газета', title: 'Культура и искусство', monthlyPrice: 4.3 },
  { index: '10018', type: 'газета', title: 'Экономический вестник', monthlyPrice: 5.0 },
  { index: '10019', type: 'газета', title: 'Образование для всех', monthlyPrice: 3.6 },
  { index: '10020', type: 'газета', title: 'Техника и наука', monthlyPrice: 4.5 },
  { index: '20004', type: 'журнал', title: 'Автомир', monthlyPrice: 8.2 },
  { index: '20005', type: 'журнал', title: 'Дом и интерьер', monthlyPrice: 7.5 },
  { index: '20006', type: 'журнал', title: 'Кулинарные секреты', monthlyPrice: 6.8 },
  { index: '20007', type: 'журнал', title: 'Мода и стиль', monthlyPrice: 9.0 },
  { index: '20008', type: 'журнал', title: 'Путешествия по миру', monthlyPrice: 8.5 },
  { index: '20009', type: 'журнал', title: 'Компьютерный мир', monthlyPrice: 7.8 },
  { index: '20010', type: 'журнал', title: 'Финансы и инвестиции', monthlyPrice: 9.5 },
  { index: '20011', type: 'журнал', title: 'Психология сегодня', monthlyPrice: 6.5 },
  { index: '20012', type: 'журнал', title: 'Исторический вестник', monthlyPrice: 7.2 },
  { index: '20013', type: 'журнал', title: 'Литературное обозрение', monthlyPrice: 6.0 },
  { index: '20014', type: 'журнал', title: 'Театр и кино', monthlyPrice: 7.4 },
  { index: '20015', type: 'журнал', title: 'Музыкальная жизнь', monthlyPrice: 6.7 },
  { index: '20016', type: 'журнал', title: 'Детский мир', monthlyPrice: 5.5 },
  { index: '20017', type: 'журнал', title: 'Подросток и общество', monthlyPrice: 5.9 },
  { index: '20018', type: 'журнал', title: 'Сад и огород', monthlyPrice: 6.3 },
  { index: '20019', type: 'журнал', title: 'Рыбалка и охота', monthlyPrice: 7.1 },
  { index: '20020', type: 'журнал', title: 'Фитнес и здоровье', monthlyPrice: 8.0 },
  { index: '20021', type: 'журнал', title: 'Архитектура и дизайн', monthlyPrice: 9.2 },
  { index: '20022', type: 'журнал', title: 'Фотография как искусство', monthlyPrice: 8.8 },
  { index: '20023', type: 'журнал', title: 'Научная фантастика', monthlyPrice: 6.9 },
  { index: '20024', type: 'журнал', title: 'Иностранные языки', monthlyPrice: 7.7 },
  { index: '20025', type: 'журнал', title: 'Бизнес и карьера', monthlyPrice: 9.8 },
  { index: '20026', type: 'журнал', title: 'Технологии будущего', monthlyPrice: 8.3 },
  { index: '20027', type: 'журнал', title: 'Медицина сегодня', monthlyPrice: 10.0 },
  { index: '20028', type: 'журнал', title: 'Экология и природа', monthlyPrice: 7.6 },
  { index: '20029', type: 'журнал', title: 'Правовая грамотность', monthlyPrice: 8.1 },
  { index: '20030', type: 'журнал', title: 'Искусство живописи', monthlyPrice: 9.5 }
];

async function seed() {
  await connectDB();

  // Чистим коллекции перед заполнением
  await Subscription.deleteMany({});
  await Recipient.deleteMany({});
  await Edition.deleteMany({});

  // Создаём издания
  const editions = await Edition.insertMany(
    editionTitles.map(e => ({
      ...e,
      photoUrl: 'https://via.placeholder.com/150'
    }))
  );

  const recipients = [];

  // Создаём получателей
  for (let i = 1; i <= 30; i++) {
    const r = await Recipient.create({
      code: `R${String(i).padStart(3, '0')}`,
      fullName: `Получатель ${i}`,
      street: `Улица ${Math.ceil(i / 3)}`,
      house: `${(i % 10) + 1}`,
      apartment: `${(i % 50) + 1}`,
      photoUrl: 'https://via.placeholder.com/150'
    });
    recipients.push(r);
  }

  const subscriptionsToCreate = [];

  // Для каждого получателя — 1–3 подписки
  recipients.forEach(recipient => {
    const subscriptionCount = 1 + Math.floor(Math.random() * 3); // от 1 до 3
    const usedEditions = new Set();

    for (let i = 0; i < subscriptionCount; i++) {
      const edition = editions[Math.floor(Math.random() * editions.length)];
      if (usedEditions.has(edition._id.toString())) continue;
      usedEditions.add(edition._id.toString());

      const monthsVariants = [1, 3, 6];
      const months = monthsVariants[Math.floor(Math.random() * monthsVariants.length)];
      const startMonth = 1 + Math.floor(Math.random() * 12);
      const currentYear = new Date().getFullYear();
      const startYear = currentYear;

      subscriptionsToCreate.push({
        recipient: recipient._id,
        edition: edition._id,
        months,
        startMonth,
        startYear
      });
    }
  });

  await Subscription.insertMany(subscriptionsToCreate);

  const recipientsCount = await Recipient.countDocuments();
  const editionsCount = await Edition.countDocuments();
  const subscriptionsCount = await Subscription.countDocuments();

  console.log('Seed completed:');
  console.log('Recipients:', recipientsCount);
  console.log('Editions:', editionsCount);
  console.log('Subscriptions:', subscriptionsCount);

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
