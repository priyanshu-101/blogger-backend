const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const User = require('./src/routes/userRoutes');
const post = require('./src/routes/postRoutes');
const comment = require('./src/routes/commentRoutes');
const request = require('./src/routes/requestRoutes');
const privacy = require('./src/routes/privacyRoutes');
const cors = require('cors'); // Import the CORS package

dotenv.config(); 

connectDB();

const app = express();
app.use(cors()); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/user', User);
app.use('/api/post', post);
app.use('/api/comment', comment);
app.use('/api/request', request);
app.use('/api/post', privacy);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
