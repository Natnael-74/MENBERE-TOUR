const User = require('./../model/user');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    // res.jsend.sucess((data = { users }), (message = users.length));

    // res.jsend.success((statusCode = 201), (data = { User } = error.message));
    res.status(200).json({
      status: 'sucess',
      len: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      messgae: error.message,
    });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // res.jsend.sucess((data = { Users }), (message = Users.length));

    // res.jsend.success((statusCode = 201), (data = { User } = error.message));
    res.status(200).json({
      status: 'sucess',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      messgae: error,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    // res.jsend.sucess((data = { Users }), (message = Users.length));

    // res.jsend.success((statusCode = 201), (data = { User } = error.message));
    res.status(201).json({
      status: 'sucess',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      messgae: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // res.jsend.sucess((data = { Users }), (message = Users.length));

    // res.jsend.success((statusCode = 201), (data = { User } = error.message));
    res.status(204).json({
      status: 'sucess',
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      messgae: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // res.jsend.sucess((data = { Users }), (message = Users.length));

    // res.jsend.success((statusCode = 201), (data = { User } = error.message));
    res.status(200).json({
      status: 'sucess',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      messgae: error.message,
    });
  }
};
