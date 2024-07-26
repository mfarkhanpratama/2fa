import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUserRequestDto {
  @IsString()
  name?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6)
  password?: string;

  @IsString()
  isActive?: boolean;
}
