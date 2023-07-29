import { IsString, Length, IsNotEmpty } from 'class-validator';

export default class LoginStaffUserDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
