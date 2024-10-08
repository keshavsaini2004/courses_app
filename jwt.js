const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: 'Token Not Found' });

  const token = authorization.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);//verify the jwt token
    req.user = decoded;//attach the user information to the request object
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

//function to generate a token 
const generateToken = (userData) => {
  const payload = { ...userData };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30m' });
};

module.exports = { jwtAuthMiddleware, generateToken };
