const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const editionsRoutes = require('./routes/editions.routes');
const recipientsRoutes = require('./routes/recipients.routes');
const subscriptionsRoutes = require('./routes/subscriptions.routes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Belpost Subscriptions API' });
});

app.use('/api/editions', editionsRoutes);
app.use('/api/recipients', recipientsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
