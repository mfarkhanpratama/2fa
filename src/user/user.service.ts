import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from './entities/user.entity';
import { CreateUserRequestDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
  ) {}

  async createUser(data: CreateUserRequestDto): Promise<User> {
    const user = this.usersRepository.create(data);
    return await this.usersRepository.save(user);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      _id: new ObjectId(id),
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    const result = await this.usersRepository.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { twoFactorAuthenticationSecret: secret } },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async getTwoFactorAuthenticationSecret(userId: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { _id: new ObjectId(userId) },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.twoFactorAuthenticationSecret;
  }
}
