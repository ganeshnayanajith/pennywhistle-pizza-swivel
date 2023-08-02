import supertest from 'supertest';
import { HTTP_CODES } from '../lib/constant';
import { expect } from 'chai';
import app from '../app';

describe('Staff user module integration tests', () => {

  it('should create a new staff user by admin and login the new staff user', async () => {

    const adminCredentials = {
      username: 'Admin',
      password: 'admin123',
    };

    const adminLoginResponse = await supertest(app).post('/api/staff-user/login').send(adminCredentials);

    console.log(`adminLoginResponse: ${JSON.stringify(adminLoginResponse.body)}`);

    expect(adminLoginResponse.body).to.have.property('status', HTTP_CODES.OK);
    expect(adminLoginResponse.body).to.have.property('message', 'Login successful');
    expect(adminLoginResponse.body).to.have.property('data');
    expect(adminLoginResponse.body.data).to.have.property('userId');
    expect(adminLoginResponse.body.data).to.have.property('accessToken');
    expect(adminLoginResponse.body.data.userId).to.be.a('string');
    expect(adminLoginResponse.body.data.accessToken).to.be.a('string');
    expect(adminLoginResponse.body).to.have.property('error', null);

    const adminAccessToken = adminLoginResponse.body.data.accessToken;

    const newStoreStaffUser = {
      'username': 'StoreStaff',
      'password': 'storestaff123',
      'role': 'StoreStaff',
    };

    const storeStaffUserCreateResponse = await supertest(app).post('/api/staff-user/create').set('Authorization', `Bearer ${adminAccessToken}`).send(newStoreStaffUser);

    console.log(`storeStaffUserCreateResponse: ${JSON.stringify(storeStaffUserCreateResponse.body)}`);

    expect(storeStaffUserCreateResponse.body).to.have.property('status', HTTP_CODES.CREATED);
    expect(storeStaffUserCreateResponse.body).to.have.property('message', 'Staff user creation successful');
    expect(storeStaffUserCreateResponse.body).to.have.property('data');
    expect(storeStaffUserCreateResponse.body.data).to.have.property('userId');
    expect(storeStaffUserCreateResponse.body.data.userId).to.be.a('string');
    expect(storeStaffUserCreateResponse.body).to.have.property('error', null);

  });


  it('should return error for staff user login with invalid credentials', async () => {

    const loginInput = {
      username: 'nousername',
      password: 'nopassword',
    };

    const failedResponse = await supertest(app).post('/api/staff-user/login').send(loginInput);

    console.log(`failedResponse: ${JSON.stringify(failedResponse.body)}`);

    expect(failedResponse.body).to.have.property('status', HTTP_CODES.BAD_REQUEST);
    expect(failedResponse.body).to.have.property('error', 'BadRequestError');
    expect(failedResponse.body).to.have.property('message', 'Invalid credentials');
    expect(failedResponse.body).to.have.property('data', null);

  });

});
