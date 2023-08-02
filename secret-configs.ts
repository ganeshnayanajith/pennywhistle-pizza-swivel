export default {
  PORT: process.env.PORT || 4000,
  BASE_URL: process.env.BASE_URL || 'http://localhost:4000',
  JWT_SECRET: process.env.JWT_SECRET || 'test',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pennywhistle-pizza-swivel',
};
