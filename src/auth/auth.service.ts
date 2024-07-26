import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserRequestDto } from '../user/dto/user.dto';
import * as speakeasy from 'speakeasy';
import { User } from '../user/entities/user.entity';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, isTwoFactorAuthenticated: boolean = false) {
    const payload = {
      email: user.email,
      sub: user._id,
      isTwoFactorAuthenticated,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDto: CreateUserRequestDto) {
    return this.userService.createUser(userDto);
  }

  async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = speakeasy.generateSecret({
      name: `MyApp (${user.email})`,
    });
    await this.userService.setTwoFactorAuthenticationSecret(
      secret.base32,
      user._id.toString(), // Ensure ObjectId is converted to string
    );

    const otpauthUrl = secret.otpauth_url;
    const qrCode = await qrcode.toDataURL(otpauthUrl);

    return { otpauthUrl, qrCode };
  }

  async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User,
  ): Promise<boolean> {
    const userSecret = await this.userService.getTwoFactorAuthenticationSecret(
      user._id.toString(),
    );
    return speakeasy.totp.verify({
      secret: userSecret,
      encoding: 'base32',
      token: twoFactorAuthenticationCode,
    });
  }

  async verifyTwoFactorAuthentication(code: string, user: User) {
    const isValid = await this.isTwoFactorAuthenticationCodeValid(code, user);
    if (!isValid) {
      throw new UnauthorizedException('Invalid authentication code');
    }
    return this.login(user, true);
  }
}
