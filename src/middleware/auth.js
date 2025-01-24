const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 


  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.decode(token);
    console.log('Decoded Token:', decoded);

    if (!decoded) {
      return res.status(403).json({ error: 'Invalid token format.' });
    }
    req.user = decoded; 
    next(); 
  } catch (err) {
    console.error('Token Decoding Error:', err.message);
    res.status(403).json({ error: 'Invalid token.' });
  }
};

module.exports = authenticateToken;
