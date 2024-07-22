const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Підключення dotenv для використання змінних середовища

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({
  origin: 'https://synertech-21d84.web.app', // Вказуйте URL вашого фронтенду
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

// Middleware для парсингу JSON
app.use(bodyParser.json());

// Підключення до MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Схема та модель для користувачів
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  select: { type: String, required: true },
  project: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Налаштування Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Ваш Gmail аккаунт
    pass: process.env.EMAIL_PASS  // Ваш пароль від Gmail
  }
});

// Функція для відправки електронної пошти
const sendEmail = (user) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'synertech2023@gmail.com',
    subject: 'New User Registration',
    text: `Name: ${user.name}\nEmail: ${user.email}\nSelect: ${user.select}\nProject: ${user.project}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Маршрут для реєстрації користувачів
app.post('/', async (req, res) => {
  const { name, email, select, project } = req.body;

  const newUser = new User({ name, email, select, project });

  try {
    await newUser.save();
    sendEmail(newUser); // Відправка електронного листа після успішного збереження користувача
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(400).json({ error: 'Error registering user' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
