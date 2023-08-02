import supertest from 'supertest';
import { HTTP_CODES } from '../lib/constant';
import { expect } from 'chai';
import app from '../app';

describe('User module unit tests', () => {

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

  it('should return error for duplicate email', async () => {

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
