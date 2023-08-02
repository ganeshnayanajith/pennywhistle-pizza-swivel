import path from 'path';
import dotenv from 'dotenv';

// loading environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, './.env') });

import { StaffUser } from './modules/staff-user/staff-user.model';
import { connectDB, disconnectDB } from './lib/database';
import { StaffUserRolesEnum } from './lib/enum';
import logger from './lib/logger';
import { Types } from 'mongoose';
import Utils from './lib/utils';

async function seedData() {
  try {
    // establishing the database connection
    await connectDB();

    const hashedPassword = await Utils.hashPassword('admin123');

    // creating a new StaffUser with the role of Admin
    const newUser = new StaffUser({
      _id: new Types.ObjectId(),
      username: 'Admin',
      password: hashedPassword,
      role: StaffUserRolesEnum.Admin,
    });

    await newUser.save();

    logger.info('Data seed completed.');

  } catch (error) {
    logger.error(`Error seeding data: ${error}`);
  } finally {
    // closing the database connection after the data seed process (regardless of success or failure)
    await disconnectDB();
  }
}

// immediately-invoked function expression (IIFE) to call the seedData function
(async () => {
  await seedData();
})();


