import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://farkhan3123:cjSNvpVY1PxRx4mz@cluster0.qa2yr8q.mongodb.net/wanderwave?retryWrites=true&w=majority',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      synchronize: true,
      logging: true,
      entities: [User],
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
