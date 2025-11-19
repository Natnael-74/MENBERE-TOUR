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

//protect middleware
exports.protect=async (req , res ,next) => {
  let token;
  if (req.header.authorization && req.header.authorization.startWith('Bearer'){
    token=req.header.authorization.split(' ')[1];
  }else if (req.cookie.jwt){
    token=req.cookie.jwt;
  }else{
    return new AppError('Please Login again ', 400);
  }
  const decode=jwt.verify(token ,process.env.SECERT_KEY);
  const currentUser= await User.find({email : decode.email});
  if(! currentUser){
    return new AppError('Please Login again ', 400);
  }

  
  req.user=currentUser
}

//forgot password
exports.forgotPassword= async (req ,res ,next) =>{
    const { email }=req.body;
    const user= await User.find({email});
    if ( !user){
      next(new AppError('No user found ', 400));
    }
    const resetToken=user.resetPassword();
    user.save({validateBeforeSave :false })
}

//reset password
exports.resetPassword(async (req ,res ,next) => {
  const token= req.params.token;
  if (!token){
    return next(new AppError('No user found ', 400))
  }
}




