const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

// Middleware для налаштування заголовків CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://synertech-21d84.web.app');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).json({});
  }
  next();
});

// Підключення до MongoDB
mongoose.connect('mongodb+srv://Alex_Gavrish:IKc0xvjnoOshP9Vp@cluster0.sdvypro.mongodb.net/synertech?retryWrites=true&w=majority')
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

// Маршрут для реєстрації користувачів
app.post('/', async (req, res) => {
  const { name, email, select, project } = req.body;

  const newUser = new User({ name, email, select, project });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(400).json({ error: 'Error registering user' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
