# Step 11: Backend - User Schema

## Goal
Create the User model with Mongoose schema for storing user accounts. Set up the Users module with service for CRUD operations.

## Prerequisites
- Step 10 completed (MongoDB connected)
- @nestjs/mongoose installed
- bcrypt installed for password hashing

## Files to Create
- `apps/api/src/users/schemas/user.schema.ts` - User schema
- `apps/api/src/users/users.module.ts` - Users module
- `apps/api/src/users/users.service.ts` - Users service
- `apps/api/src/users/users.controller.ts` - Users controller (optional)
- `apps/api/src/app.module.ts` - Import users module

## Implementation Details

### 1. Create Users Directory Structure
```bash
mkdir -p apps/api/src/users/schemas
```

### 2. Create User Schema (`apps/api/src/users/schemas/user.schema.ts`)

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  username: string

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)

// Indexes for performance
UserSchema.index({ email: 1 })
UserSchema.index({ username: 1 })
```

### 3. Create Users Service (`apps/api/src/users/users.service.ts`)

```typescript
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { User, UserDocument } from './schemas/user.schema'

export interface CreateUserDto {
  username: string
  email: string
  password: string
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Create a new user with hashed password
   */
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    })

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('Email already registered')
      }
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException('Username already taken')
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    // Create user
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    })

    return newUser.save()
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec()
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec()
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec()
  }

  /**
   * Validate user password
   */
  async validatePassword(user: UserDocument, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password)
  }

  /**
   * Get all users (admin only - for debugging)
   */
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password').exec()
  }

  /**
   * Update user
   */
  async update(id: string, updateData: Partial<User>): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec()

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException('User not found')
    }
  }
}
```

### 4. Create Users Module (`apps/api/src/users/users.module.ts`)

```typescript
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersService } from './users.service'
import { User, UserSchema } from './schemas/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### 5. Create Users Controller (Optional - for testing) (`apps/api/src/users/users.controller.ts`)

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Temporary endpoint for testing - remove in production
  @Get()
  async findAll() {
    return this.usersService.findAll()
  }
}
```

### 6. Update Users Module to Include Controller

Update `apps/api/src/users/users.module.ts`:
```typescript
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User, UserSchema } from './schemas/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### 7. Update App Module (`apps/api/src/app.module.ts`)

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule, // Add this
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

2. **Check compilation:**
   - No TypeScript errors
   - Server starts successfully
   - Users module loaded

3. **Test user creation (using MongoDB Compass or mongosh):**
   ```javascript
   // In mongosh
   use quiz-app
   db.users.insertOne({
     username: "testuser",
     email: "test@example.com",
     password: "$2b$10$hashedpassword",
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

4. **Test users endpoint (if controller created):**
   ```bash
   curl http://localhost:3000/users
   ```
   - Should return empty array or test user

5. **Check database:**
   - Open MongoDB Compass
   - Connect to quiz-app database
   - Should see `users` collection
   - Verify indexes created (email, username)

6. **Test service methods (optional - via NestJS console or test):**
   ```typescript
   // Can add temporary test endpoint for verification
   ```

## Success Criteria
✅ User schema created with Mongoose
✅ Users service with CRUD operations
✅ Password hashing with bcrypt
✅ Unique constraints on email and username
✅ Users module exports service
✅ Module imported in app.module
✅ Server starts without errors
✅ Users collection created in MongoDB

## Troubleshooting

**Issue:** bcrypt errors on compilation
- **Fix:** Ensure bcrypt is installed: `pnpm --filter api add bcrypt`
- May need to rebuild: `pnpm rebuild bcrypt`

**Issue:** Mongoose model not found
- **Fix:** Check MongooseModule.forFeature in users.module
- Verify User.name matches schema class name

**Issue:** Duplicate key error on indexes
- **Fix:** Drop existing indexes in MongoDB
- ```javascript
  db.users.dropIndexes()
  ```

**Issue:** TypeScript errors with UserDocument
- **Fix:** Ensure mongoose is installed with types
- Check import from 'mongoose'

## Schema Features

1. **Unique Constraints:** Email and username must be unique
2. **Timestamps:** Automatic createdAt and updatedAt
3. **Indexes:** Performance optimization for queries
4. **Validation:** Required fields enforced
5. **Password Security:** Hashed with bcrypt (cost factor 10)
6. **Case Handling:** Email lowercase, trimmed

## Service Features

1. **User Creation:** With duplicate checking
2. **Password Hashing:** Automatic during creation
3. **Password Validation:** Compare helper method
4. **Flexible Queries:** By email, username, or ID
5. **Error Handling:** Appropriate exceptions thrown
6. **Password Exclusion:** Select('-password') in findAll

## File Structure After This Step
```
apps/api/src/
├── users/
│   ├── schemas/
│   │   └── user.schema.ts     # New: User model
│   ├── users.module.ts        # New: Users module
│   ├── users.service.ts       # New: User service
│   └── users.controller.ts    # New: Test endpoint
└── app.module.ts              # Updated: Imports UsersModule
```

## Next Step
**Step 12: Backend - Auth Endpoints** - Create authentication endpoints (register, login, profile) with JWT
