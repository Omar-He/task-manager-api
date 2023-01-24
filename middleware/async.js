const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error); // to handle the error by the middleware
    }
  };
};

module.exports = asyncWrapper;
