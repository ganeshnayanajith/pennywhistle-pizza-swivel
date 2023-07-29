import { IsString, IsEmail, Length } from 'class-validator';
import { IsMobileNumber } from '../../../lib/decorators/is-mobile-number.decorator';

export default class RegisterUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsMobileNumber()
  mobileNumber: string;

  @IsString()
  @Length(8, 20)
  password: string;

  constructor(name: string, email: string, mobileNumber: string, password: string) {
    this.name = name;
    this.email = email;
    this.mobileNumber = mobileNumber;
    this.password = password;
  }
}
