import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Inject,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserRequestDto } from '../user/dto/user.dto';
import { LocalAuthGuard } from '@app/common/local-auth.guard';
import { JwtAuthGuard } from '@app/common/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserRequestDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('generate-2fa-secret')
  async generateTwoFactorAuthenticationSecret(@Request() req) {
    this.logger.log(`Request user: ${JSON.stringify(req.user)}`);

    if (!req.user || !req.user._id) {
      throw new NotFoundException('User not found or user ID is undefined');
    }

    const { otpauthUrl, qrCode } =
      await this.authService.generateTwoFactorAuthenticationSecret(req.user);
    return { otpauthUrl, qrCode };
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-2fa')
  async verifyTwoFactorAuthentication(
    @Request() req,
    @Body('code') code: string,
  ) {
    return this.authService.verifyTwoFactorAuthentication(code, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
