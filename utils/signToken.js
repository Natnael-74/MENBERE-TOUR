import jwt from 'jsonwebtoken';

function signToken(id, res, message, user = null) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // remove sensitive fields
  if (user) {
    user.password = undefined;
    user.passwordChangedAt = undefined;
  }

  res.status(201).json({
    status: 'success',
    message,
    token,
    data: {
      user,
    },
  });
}

export default signToken;
