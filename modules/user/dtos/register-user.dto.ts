import { IsString, IsEmail, Length, IsNotEmpty } from 'class-validator';
import { IsMobileNumber } from '../../../lib/decorators/is-mobile-number.decorator';

export default class RegisterUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsMobileNumber()
  mobileNumber: string;

  @IsNotEmpty()
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
