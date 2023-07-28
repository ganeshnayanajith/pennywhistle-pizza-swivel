import mongoose from 'mongoose';
import secretConfigs from '../secret-configs';
import logger from './logger';

const connectDB = async () => {
  try {
    await mongoose.connect(secretConfigs.MONGODB_URI);
    logger.info('MongoDB Connected.');
    return Promise.resolve('MongoDB Connected');
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error}`);
    return Promise.reject(error);
  }
};

export default connectDB;
