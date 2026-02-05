const Tour = require('./../model/tour');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    // res.jsend.sucess((data = { tours }), (message = tours.length));

    // res.jsend.success((statusCode = 201), (data = { tour } = error.message));
    res.status(200).json({
      status: 'sucess',
      len: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      messgae: error.message,
    });
  }
};

exports.getSingleTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findById(id);
    // res.jsend.sucess((data = { Users }), (message = Users.length));

    // res.jsend.success((statusCode = 201), (data = { User } = error.message));
    res.status(200).json({
      status: 'sucess',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      messgae: error.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    // res.jsend.sucess((data = { tours }), (message = tours.length));

    // res.jsend.success((statusCode = 201), (data = { tour } = error.message));
    res.status(201).json({
      status: 'sucess',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      messgae: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // res.jsend.sucess((data = { tours }), (message = tours.length));

    // res.jsend.success((statusCode = 201), (data = { tour } = error.message));
    res.status(200).json({
      status: 'sucess',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      messgae: error.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    // res.jsend.sucess((data = { tours }), (message = tours.length));

    // res.jsend.success((statusCode = 201), (data = { tour } = error.message));
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
