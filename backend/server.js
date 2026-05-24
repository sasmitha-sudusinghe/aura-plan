require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scheduleDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/exams', require('./routes/exams'));
app.use('/api/gym', require('./routes/gym'));
app.use('/api/calendar-notes', require('./routes/calendarNotes'));

app.get('/', (req, res) => {
  res.send('Exam & Gym Scheduler API is running');
});

app.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
});
