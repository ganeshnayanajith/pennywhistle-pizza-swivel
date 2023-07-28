import { IsString, IsEmail, IsMobilePhone, Length } from 'class-validator';

export default class RegisterUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsMobilePhone()
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
