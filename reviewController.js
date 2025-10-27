const Review = require('./');

exports.getAllreviews = async (req, res) => {
  try {
    const reviews = await Review.find();

    res.status(200).json({
      status: 'sucess',
      len: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      messgae: error.message,
    });
  }
};

exports.getSinglereview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    res.status(200).json({
      status: 'sucess',
      data: {
        review
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      messgae: error.message,
    });
  }
};


exports.createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    // res.jsend.sucess((data = { reviews }), (message = reviews.length));

    // res.jsend.success((statusCode = 201), (data = { Review } = error.message));
    res.status(201).json({
      status: 'sucess',
      data: {
        review,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      messgae: error.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);

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

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body);
    
    res.status(200).json({
      status: 'sucess',
      data: {
        review,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      messgae: error.message,
    });
  }
};
