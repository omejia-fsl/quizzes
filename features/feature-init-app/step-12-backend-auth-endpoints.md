# Step 12: Backend - Auth Endpoints

## Goal
Create authentication module with register, login, and profile endpoints. Implement JWT token generation and validation using Passport.js strategies.

## Prerequisites
- Step 11 completed (User schema ready)
- @nestjs/jwt, @nestjs/passport, passport-jwt installed
- nestjs-zod installed for validation
- JWT_SECRET and JWT_EXPIRES_IN in .env

## Files to Create
- `apps/api/src/auth/auth.module.ts` - Auth module
- `apps/api/src/auth/auth.service.ts` - Auth service
- `apps/api/src/auth/auth.controller.ts` - Auth controller
- `apps/api/src/auth/dto/auth.dto.ts` - DTOs with nestjs-zod
- `apps/api/src/auth/strategies/jwt.strategy.ts` - JWT strategy
- `apps/api/src/auth/guards/jwt-auth.guard.ts` - JWT guard
- `apps/api/src/app.module.ts` - Import auth module

## Implementation Details

### 1. Create Auth Directory
```bash
mkdir -p apps/api/src/auth/dto
mkdir -p apps/api/src/auth/strategies
mkdir -p apps/api/src/auth/guards
```

### 2. Create DTOs with nestjs-zod (`apps/api/src/auth/dto/auth.dto.ts`)

```typescript
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

// Register schema
export const RegisterSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

export class RegisterDto extends createZodDto(RegisterSchema) {}

// Login schema
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export class LoginDto extends createZodDto(LoginSchema) {}

// Response types
export interface AuthResponse {
  access_token: string
  user: {
    id: string
    username: string
    email: string
  }
}
```

### 3. Create JWT Strategy (`apps/api/src/auth/strategies/jwt.strategy.ts`)

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '../../users/users.service'

export interface JwtPayload {
  sub: string // user ID
  email: string
  username: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub)

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    // Return user object (available as req.user)
    return {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    }
  }
}
```

### 4. Create JWT Guard (`apps/api/src/auth/guards/jwt-auth.guard.ts`)

```typescript
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context)
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or missing token')
    }
    return user
  }
}
```

### 5. Create Auth Service (`apps/api/src/auth/auth.service.ts`)

```typescript
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { RegisterDto, LoginDto, AuthResponse } from './dto/auth.dto'
import { JwtPayload } from './strategies/jwt.strategy'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      // Create user
      const user = await this.usersService.create(registerDto)

      // Generate JWT token
      const token = await this.generateToken(user)

      return {
        access_token: token,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      throw new Error('Registration failed')
    }
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // Find user
    const user = await this.usersService.findByEmail(loginDto.email)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Validate password
    const isPasswordValid = await this.usersService.validatePassword(
      user,
      loginDto.password,
    )
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Generate JWT token
    const token = await this.generateToken(user)

    return {
      access_token: token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    }
  }

  /**
   * Generate JWT token
   */
  private async generateToken(user: any): Promise<string> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
    }

    return this.jwtService.sign(payload)
  }

  /**
   * Validate JWT token (used by strategy)
   */
  async validateUser(payload: JwtPayload) {
    return this.usersService.findById(payload.sub)
  }
}
```

### 6. Create Auth Controller (`apps/api/src/auth/auth.controller.ts`)

```typescript
import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto, LoginDto } from './dto/auth.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register new user
   * POST /auth/register
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  /**
   * Login user
   * POST /auth/login
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  /**
   * Get current user profile
   * GET /auth/profile
   * Requires authentication
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return {
      user: req.user,
    }
  }
}
```

### 7. Create Auth Module (`apps/api/src/auth/auth.module.ts`)

```typescript
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

### 8. Setup nestjs-zod Globally (`apps/api/src/main.ts`)

```typescript
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('Bootstrap')

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  })

  // Use Zod validation globally
  app.useGlobalPipes(new ZodValidationPipe())

  const port = process.env.PORT || 3000
  await app.listen(port)

  logger.log(`🚀 Application is running on: http://localhost:${port}`)
  logger.log(`📊 Health check available at: http://localhost:${port}/health`)
  logger.log(`🔐 Auth endpoints: http://localhost:${port}/auth`)
}

bootstrap()
```

### 9. Update App Module (`apps/api/src/app.module.ts`)

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module' // Add this

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    AuthModule, // Add this
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Verification Steps

1. **Start backend server:**
   ```bash
   pnpm dev:api
   ```

2. **Test registration:**
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123"
     }'
   ```
   - Should return access_token and user object

3. **Test login:**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```
   - Should return access_token and user object

4. **Test profile endpoint (protected):**
   ```bash
   curl -X GET http://localhost:3000/auth/profile \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```
   - Should return user object
   - Without token: 401 Unauthorized

5. **Test validation:**
   ```bash
   # Invalid email
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username": "test", "email": "invalid", "password": "pass"}'
   ```
   - Should return validation errors

6. **Check database:**
   - User should be created in MongoDB
   - Password should be hashed (starts with $2b$)

## Success Criteria
✅ Auth module created and imported
✅ Register endpoint works (/auth/register)
✅ Login endpoint works (/auth/login)
✅ Profile endpoint protected (/auth/profile)
✅ JWT tokens generated correctly
✅ Password hashing works
✅ Validation with nestjs-zod
✅ Proper error handling (401, 409, etc.)

## Troubleshooting

**Issue:** JWT errors on login
- **Fix:** Verify JWT_SECRET in .env
- Check JwtModule configuration

**Issue:** Validation not working
- **Fix:** Ensure ZodValidationPipe is global
- Check nestjs-zod is installed

**Issue:** 401 on profile endpoint
- **Fix:** Verify token format: "Bearer <token>"
- Check JwtStrategy is registered

**Issue:** Password comparison fails
- **Fix:** Ensure bcrypt is installed
- Check validatePassword method

## API Endpoints Summary

- `POST /auth/register` - Create new account
- `POST /auth/login` - Login and get JWT
- `GET /auth/profile` - Get user info (protected)

## File Structure After This Step
```
apps/api/src/
├── auth/
│   ├── dto/
│   │   └── auth.dto.ts           # New: DTOs
│   ├── strategies/
│   │   └── jwt.strategy.ts       # New: JWT strategy
│   ├── guards/
│   │   └── jwt-auth.guard.ts     # New: JWT guard
│   ├── auth.module.ts            # New: Auth module
│   ├── auth.service.ts           # New: Auth service
│   └── auth.controller.ts        # New: Auth endpoints
├── app.module.ts                 # Updated: Imports auth
└── main.ts                       # Updated: Zod validation
```

## Next Step
**Step 13: Frontend - Auth Store** - Complete authentication store with login/logout actions and API integration
