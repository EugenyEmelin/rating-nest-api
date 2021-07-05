import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserModel } from './user.model';
import { InjectModel } from 'nestjs-typegoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ReturnModelType<typeof UserModel>,
    private readonly jwtService: JwtService
  ) {}

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10)
    const newUser = new this.userModel({
      email: dto.login,
      passwordHash: await hash(dto.password, salt)
    })
    return newUser.save()
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec()
  }

  async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
    const candidate = await this.findUser(email)
    console.log('candidate', candidate)
    if (!candidate) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR)
    }
    const isCorrectPassword = await compare(password, candidate.passwordHash)
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR)
    }
    return {
      email: candidate.email
    }
  }

  async login(email: string) {
    const payload = { email }
    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
