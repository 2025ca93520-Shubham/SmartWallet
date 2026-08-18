export const successResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    status: 'success',
    statusCode,
    data,
  });
};

export const errorResponse = (res, message, statusCode = 400) => {
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
