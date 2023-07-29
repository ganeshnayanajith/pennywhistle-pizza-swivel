import { IsString, IsEmail, Length, IsNotEmpty } from 'class-validator';

export default class LoginUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
