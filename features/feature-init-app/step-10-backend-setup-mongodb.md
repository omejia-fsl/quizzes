# Step 10: Backend - Setup MongoDB Connection

## Goal
Configure MongoDB database connection in the NestJS backend using Mongoose. Set up environment variables and create a database module that can be imported throughout the application.

## Prerequisites
- Step 9 completed (Home page done)
- @nestjs/mongoose and mongoose installed in apps/api
- MongoDB instance available (local or cloud like MongoDB Atlas)

## Files to Create/Modify
- `apps/api/.env` - Environment variables
- `apps/api/src/database/database.module.ts` - Database module
- `apps/api/src/app.module.ts` - Import database module
- `apps/api/.env.example` - Template for other developers

## Implementation Details

### 1. Create Environment File (`apps/api/.env`)

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/quiz-app
# For MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/quiz-app

# JWT Configuration (for later steps)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=development
```

**Important:** Add `.env` to `.gitignore` if not already there.

### 2. Create Example Environment File (`apps/api/.env.example`)

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/quiz-app

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=development
```

### 3. Create Database Module

```bash
mkdir -p apps/api/src/database
```

Create `apps/api/src/database/database.module.ts`:
```typescript
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        // Connection options
        retryAttempts: 3,
        retryDelay: 1000,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
```

### 4. Update App Module (`apps/api/src/app.module.ts`)

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'

@Module({
  imports: [
    // Environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Database
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 5. Add Health Check Endpoint (Optional but Recommended)

Update `apps/api/src/app.service.ts`:
```typescript
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Quiz API is running!'
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'quiz-api',
    }
  }
}
```

Update `apps/api/src/app.controller.ts`:
```typescript
import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('health')
  getHealth() {
    return this.appService.getHealth()
  }
}
```

### 6. Add Mongoose Connection Logging (Optional)

Update `apps/api/src/main.ts` to add connection listeners:
```typescript
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('Bootstrap')

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true,
  })

  const port = process.env.PORT || 3000
  await app.listen(port)

  logger.log(`🚀 Application is running on: http://localhost:${port}`)
  logger.log(`📊 Health check available at: http://localhost:${port}/health`)
}

bootstrap()
```

## Setting Up MongoDB

### Option 1: Local MongoDB

1. **Install MongoDB:**
   - macOS: `brew install mongodb-community`
   - Linux: Follow official MongoDB docs
   - Windows: Download from mongodb.com

2. **Start MongoDB:**
   ```bash
   brew services start mongodb-community  # macOS
   # or
   mongod  # Manual start
   ```

3. **Verify running:**
   ```bash
   mongosh  # MongoDB shell
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string
6. Update `MONGODB_URI` in `.env`

## Verification Steps

1. **Check environment variables:**
   ```bash
   cat apps/api/.env
   ```
   - MONGODB_URI should be set

2. **Start backend server:**
   ```bash
   pnpm dev:api
   ```

3. **Check console output:**
   - Should see "Application is running" message
   - No MongoDB connection errors
   - If successful: "Connected to MongoDB" (if you added custom logging)

4. **Test health endpoint:**
   ```bash
   curl http://localhost:3000/health
   ```
   - Should return JSON with status "ok"

5. **Test root endpoint:**
   ```bash
   curl http://localhost:3000
   ```
   - Should return "Quiz API is running!"

6. **Check MongoDB connection:**
   - Open MongoDB Compass or mongosh
   - Connect to your MongoDB instance
   - Should see `quiz-app` database (created automatically)

7. **Check for errors:**
   - No connection timeout errors
   - No authentication errors
   - Server stays running without crashes

## Success Criteria
✅ MongoDB connection configured with Mongoose
✅ Environment variables loaded
✅ Database module created
✅ App module imports database module
✅ Server starts without connection errors
✅ Health check endpoint works
✅ CORS enabled for frontend
✅ .env.example created for team

## Troubleshooting

**Issue:** Connection timeout
- **Fix:** Check MongoDB is running
- Verify MONGODB_URI is correct
- Check network/firewall settings

**Issue:** Authentication failed
- **Fix:** Verify username/password in connection string
- Check database user has proper permissions

**Issue:** Module not found errors
- **Fix:** Ensure @nestjs/mongoose and mongoose are installed
- Run `pnpm install` in apps/api

**Issue:** ConfigModule errors
- **Fix:** Ensure @nestjs/config is installed
- Check .env file location (should be in apps/api/)

**Issue:** CORS errors from frontend
- **Fix:** Verify origin in enableCors matches frontend URL
- Check port numbers match

## MongoDB Connection String Format

```
mongodb://localhost:27017/quiz-app           # Local
mongodb://username:password@localhost:27017/quiz-app  # Local with auth
mongodb+srv://user:pass@cluster.mongodb.net/quiz-app  # Atlas
```

## File Structure After This Step
```
apps/api/
├── .env                       # New: Environment variables
├── .env.example               # New: Template
├── src/
│   ├── database/
│   │   └── database.module.ts # New: DB module
│   ├── app.module.ts          # Updated: Imports DB
│   ├── app.controller.ts      # Updated: Health check
│   ├── app.service.ts         # Updated: Health method
│   └── main.ts                # Updated: CORS + logging
```

## Next Step
**Step 11: Backend - User Schema** - Create User model with Mongoose for authentication
