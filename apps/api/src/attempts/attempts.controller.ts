import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AttemptsService, AttemptsListResult } from './attempts.service';
import { AttemptFiltersDto, UserStatsDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuizAttempt } from '../database/schemas';

@Controller('attempts')
@UseGuards(JwtAuthGuard)
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMyAttempts(
    @Query() filters: AttemptFiltersDto,
    @Request() req: { user: { userId: string } },
  ): Promise<AttemptsListResult> {
    const { page, limit } = filters;
    return this.attemptsService.findByUser(req.user.userId, { page, limit });
  }

  @Get('me/stats')
  @HttpCode(HttpStatus.OK)
  async getMyStats(
    @Request() req: { user: { userId: string } },
  ): Promise<UserStatsDto> {
    return this.attemptsService.getUserStats(req.user.userId);
  }

  @Get('me/:attemptId')
  @HttpCode(HttpStatus.OK)
  async getMyAttemptById(
    @Param('attemptId') attemptId: string,
    @Request() req: { user: { userId: string } },
  ): Promise<QuizAttempt> {
    return this.attemptsService.findById(attemptId, req.user.userId);
  }

  @Get('quiz/:quizId')
  @HttpCode(HttpStatus.OK)
  async getMyQuizAttempts(
    @Param('quizId') quizId: string,
    @Query() filters: AttemptFiltersDto,
    @Request() req: { user: { userId: string } },
  ): Promise<AttemptsListResult> {
    const { page, limit } = filters;
    return this.attemptsService.findByQuiz(quizId, req.user.userId, {
      page,
      limit,
    });
  }
}
