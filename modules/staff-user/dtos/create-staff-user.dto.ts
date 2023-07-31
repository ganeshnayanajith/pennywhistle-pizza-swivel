import { IsString, Length, IsNotEmpty, IsEnum, IsAlphanumeric } from 'class-validator';
import { StaffUserRolesEnum } from '../../../lib/enum';

export default class CreateStaffUserDTO {
  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;

  @IsEnum(StaffUserRolesEnum)
  role: StaffUserRolesEnum;

  constructor(username: string, password: string, role: StaffUserRolesEnum) {
    this.username = username;
    this.password = password;
    this.role = role;
  }
}
