import supertest from 'supertest';
import { HTTP_CODES } from '../lib/constant';
import { expect } from 'chai';
import app from '../app';

describe('User module integration tests', () => {

  it('should register a new user', async () => {

    const newUser = {
      name: 'Swivel customer',
      email: 'swivel.customer@gmail.com',
      mobileNumber: '+94776361100',
      password: 'password',
    };

    const response = await supertest(app).post('/api/user/register').send(newUser);

    console.log(`response: ${JSON.stringify(response.body)}`);

    expect(response.body).to.have.property('status', HTTP_CODES.CREATED);
    expect(response.body).to.have.property('message', 'Registration successful');
    expect(response.body).to.have.property('data');
    expect(response.body.data).to.have.property('userId');
    expect(response.body.data.userId).to.be.a('string');
    expect(response.body).to.have.property('error', null);

  });


  it('should login a user', async () => {

    const newUser = {
      name: 'Swivel customer login',
      email: 'swivel.logincustomer@gmail.com',
      mobileNumber: '+94776361112',
      password: 'passwordlogin',
    };

    const response = await supertest(app).post('/api/user/register').send(newUser);

    console.log(`response: ${JSON.stringify(response.body)}`);

    expect(response.body).to.have.property('status', HTTP_CODES.CREATED);
    expect(response.body).to.have.property('message', 'Registration successful');
    expect(response.body).to.have.property('data');
    expect(response.body.data).to.have.property('userId');
    expect(response.body.data.userId).to.be.a('string');
    expect(response.body).to.have.property('error', null);

    const loginInput = {
      email: 'swivel.logincustomer@gmail.com',
      password: 'passwordlogin',
    };

    const loginResponse = await supertest(app).post('/api/user/login').send(loginInput);

    console.log(`loginResponse: ${JSON.stringify(loginResponse.body)}`);

    expect(loginResponse.body).to.have.property('status', HTTP_CODES.OK);
    expect(loginResponse.body).to.have.property('message', 'Login successful');
    expect(loginResponse.body).to.have.property('data');
    expect(loginResponse.body.data).to.have.property('userId');
    expect(loginResponse.body.data).to.have.property('accessToken');
    expect(loginResponse.body.data.userId).to.be.a('string');
    expect(loginResponse.body.data.accessToken).to.be.a('string');
    expect(loginResponse.body).to.have.property('error', null);

  });


  it('should return error for user login with invalid credentials', async () => {

    const loginInput = {
      email: 'noemail@gmail.com',
      password: 'nopassword',
    };

    const failedResponse = await supertest(app).post('/api/user/login').send(loginInput);

    console.log(`failedResponse: ${JSON.stringify(failedResponse.body)}`);

    expect(failedResponse.body).to.have.property('status', HTTP_CODES.BAD_REQUEST);
    expect(failedResponse.body).to.have.property('error', 'BadRequestError');
    expect(failedResponse.body).to.have.property('message', 'Invalid credentials');
    expect(failedResponse.body).to.have.property('data', null);

  });


  it('should return error for user registration with existing email', async () => {

    const existingUser = {
      name: 'Swivel customer one',
      email: 'swivel.customer1@gmail.com',
      mobileNumber: '+94776361101',
      password: 'password',
    };

    const response = await supertest(app).post('/api/user/register').send(existingUser);

    console.log(`response: ${JSON.stringify(response.body)}`);

    expect(response.body).to.have.property('status', HTTP_CODES.CREATED);
    expect(response.body).to.have.property('message', 'Registration successful');
    expect(response.body).to.have.property('data');
    expect(response.body.data).to.have.property('userId');
    expect(response.body.data.userId).to.be.a('string');
    expect(response.body).to.have.property('error', null);

    const newUserWithExistingEmail = {
      name: 'Swivel customer one new',
      email: 'swivel.customer1@gmail.com',
      mobileNumber: '+94776361102',
      password: 'password',
    };

    const failedResponse = await supertest(app).post('/api/user/register').send(newUserWithExistingEmail);

    console.log(`failedResponse: ${JSON.stringify(failedResponse.body)}`);

    expect(failedResponse.body).to.have.property('status', HTTP_CODES.BAD_REQUEST);
    expect(failedResponse.body).to.have.property('error', 'ValidationError');
    expect(failedResponse.body).to.have.property('message', 'User already exists with the same email or mobile number.');
    expect(failedResponse.body).to.have.property('data', null);

  });


});
