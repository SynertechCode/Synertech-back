require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Використання CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Підключення до MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB підключено'))
.catch(err => console.error('Помилка підключення до MongoDB', err));

// Створення моделі користувача
const User = mongoose.model('User', {
  name: String,
  email: String,
  select: String,
  project: String
});

// Middleware для обробки JSON і форм
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Роут для збереження користувача в базу даних
app.post('/syner/users', async (req, res) => {
  const { name, email, select, project } = req.body;

  console.log('Отримано запит на створення користувача з даними:', req.body);

  try {
    const newUser = new User({ name, email, select, project });
    await newUser.save();

    console.log(`Збережено нового користувача: ${name}, ${email}, ${select}, ${project}`);

    res.status(201).json({ message: 'Користувач збережений в базу даних' });
  } catch (err) {
    console.error('Помилка збереження користувача:', err);
    res.status(400).json({ message: err.message });
  }
});

// Middleware для обслуговування статичних файлів
app.use(express.static('public'));

// Прослуховування сервера
app.listen(port, () => {
  console.log(`Сервер запущено на http://localhost:${port}`);
});
