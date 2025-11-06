import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, AuthResponse } from './dto/auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      const user = await this.usersService.create(registerDto);

      const token = await this.generateToken(user);

      return {
        access_token: token,
        user: {
          id: (user._id as any).toString(),
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      loginDto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user);

    return {
      access_token: token,
      user: {
        id: (user._id as any).toString(),
        username: user.username,
        email: user.email,
      },
    };
  }

  private async generateToken(user: any): Promise<string> {
    const payload: JwtPayload = {
      sub: (user._id as any).toString(),
      email: user.email,
      username: user.username,
    };

    return this.jwtService.sign(payload);
  }

  async validateUser(payload: JwtPayload) {
    return this.usersService.findById(payload.sub);
  }
}
