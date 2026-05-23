const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const userAuthRoutes = require('./routes/user-auth-routes');
const roomManagementRoutes = require('./routes/room-management-routes');

app.use('/api/user', userAuthRoutes);
app.use('/api/rooms', roomManagementRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
