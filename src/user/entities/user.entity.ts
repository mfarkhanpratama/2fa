// src/user/entities/user.entity.ts
import { Entity, ObjectIdColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  twoFactorAuthenticationSecret?: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
