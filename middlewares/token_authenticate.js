const jwt = require('jsonwebtoken');
const { model } = require('mongoose');
const JWT_SECRET = 'MDFNJGNJNDBFNJNJVNJCNCJ'; // Replace with your actual secret key

function authenticateToken(req, res, next) {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
  // console.log("Token:", token);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };