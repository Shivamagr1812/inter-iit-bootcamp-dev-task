const jwt = require('jsonwebtoken');

//Authenticating JWS Token using cookies

const authenticateToken = (req, res, next) => {
	const token = req.cookies['token'];
	if (!token) {
		return res.status(401).json({ error: 'Access Denied: No token provided' });
	}

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		next();
	} catch (err) {
		res.status(403).json({ error: 'Invalid Token' });
	}
};

module.exports = { authenticateToken };
