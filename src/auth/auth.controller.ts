import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() authDto: AuthDto) {
    const candidate = await this.authService.findUser(authDto.login)
    if (candidate) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR)
    }
    return this.authService.createUser(authDto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const { email } = await this.authService.validateUser(authDto.login, authDto.password)
    return this.authService.login(email)
  }
}
