exports.errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Send a generic error response
    res.status(500).json({
      error: 'Server error',
      message: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong' 
        : err.message
    });
  };