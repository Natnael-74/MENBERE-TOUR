const User = require('../model/userModel');
const createToken = require('../utils/createToken');

//signup
exports.signup = async (res, req) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.create({ name, email, password, passwordConfirm });
  createToken.createToken(user, 200, res);
};

//login
exports.login = async (res, req, next) => {
  const { email, password } = req.body;

  if(!email || !password){
    return next(new AppError('please provide email and password'))
  }
  
  const user = await User.find({ email });

  if (!user) {
    return next(new AppError('No user with this email.', 400));
  }

  createToken.createToken(user, 200, res);
};

