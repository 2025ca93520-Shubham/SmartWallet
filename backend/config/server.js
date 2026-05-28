export const serverConfig = {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
  },
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
};

export const apiConfig = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  prefix: '/api',
};
