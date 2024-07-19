const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware для парсингу JSON
app.use(bodyParser.json());

// Підключення до MongoDB
mongoose.connect('mongodb+srv://Alex_Gavrish:IKc0xvjnoOshP9Vp@cluster0.sdvypro.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Схема та модель для користувачів
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    select: String,
    project: String
});

const User = mongoose.model('User', userSchema);

// Маршрут для реєстрації користувачів
app.post('/api/register', async (req, res) => {
    const { name, email, select, project } = req.body;
    const newUser = new User({ name, email, select, project });

    try {
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(400).send('Error registering user');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
