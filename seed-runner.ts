import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, './.env') });

import { StaffUser } from './modules/staff-user/staff-user.model';
import { connectDB, disconnectDB } from './lib/database';
import { StaffUserRolesEnum } from './lib/enum';
import logger from './lib/logger';
import { Types } from 'mongoose';

async function seedData() {
  try {

    await connectDB();

    const newUser = new StaffUser({
      _id: new Types.ObjectId(),
      username: 'Admin',
      password: 'admin123',
      role: StaffUserRolesEnum.Admin,
    });

    await newUser.save();

    logger.info('Data seed completed.');

  } catch (error) {
    logger.error(`Error seeding data: ${error}`);
  } finally {
    await disconnectDB();
  }
}

(async () => {
  await seedData();
})();


