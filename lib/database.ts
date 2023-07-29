import mongoose from 'mongoose';
import secretConfigs from '../secret-configs';
import logger from './logger';

export const connectDB = async () => {
  try {
    await mongoose.connect(secretConfigs.MONGODB_URI);
    logger.info('MongoDB connected.');
    return Promise.resolve('MongoDB connected');
  } catch (error) {
    logger.error(`MongoDB connection error: ${error}`);
    return Promise.reject(error);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected.');
    return Promise.resolve('MongoDB disconnected');
  } catch (error) {
    logger.error(`MongoDB disconnection error: ${error}`);
    return Promise.reject(error);
  }
};
