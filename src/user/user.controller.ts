// src/user/user.controller.ts
import { Controller, Post, Get, Body, Param, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserRequestDto): Promise<User> {
    this.logger.log('Creating a new user');
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    this.logger.log(`Fetching user with id: ${id}`);
    return this.userService.getUserById(id);
  }
}
