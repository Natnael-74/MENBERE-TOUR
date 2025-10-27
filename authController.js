const User = require('../model/userModel');
const createToken = require('../utils/createToken');

exports.signup = async (res, req) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.create({ name, email, password, passwordConfirm });
  createToken.createToken(user, 200, res);
};

exports.login = async (res, req) => {
  const { email, password } = req.body;
  const user = await User.find({ email });

  if (!user) {
    return next(new AppError('No user with this email.', 400));
  }

  createToken.createToken(user, 200, res);
};
