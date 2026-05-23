const bcrypt = require('bcrypt');
const pool = require('../database/pool');

const signUp = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] =await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]
        );
        res.status(201).json({ id: result.insertID, username, email });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username or email already exists' });
        }
        console.error('Sign up error: ', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const signIn = async (req, res) => {
    const {email, password} = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        return res.json({ id: user.id, username: user.username, email: user.email });
    } catch (err) {
        console.error('Login error: ', err);
        res.status(500).json({ message: 'Internal Server error' });
    }
}

module.exports = { signUp, signIn };