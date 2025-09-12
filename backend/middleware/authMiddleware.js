const jwt = require('jsonwebtoken');

const protect = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No token, access denied' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded role:', decoded.role);
      console.log('Allowed roles:', roles);

      if (roles.length && !roles.includes(decoded.role)) {
        console.log('❌ Forbidden: role mismatch');
        return res.status(403).json({ error: 'Forbidden' });
      }

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};


module.exports = { protect };
