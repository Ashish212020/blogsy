const { validateToken } = require("../services/authentication");
const User = require("../models/user"); // <-- Add this

function checkForAuthenticationCookie(cookieName) {
  return async (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      // Fetch the full user from DB using the ID in the payload
      const user = await User.findById(userPayload._id);
      req.user = user;
    } catch (error) {
      req.user = null;
    }

    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};