import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuizzesService, QuizListResult } from './quizzes.service';
import {
  QuizFiltersDto,
  CategoriesResponseDto,
  SubmitQuizDto,
  QuizResultDto,
} from './dto';
import { PublicQuiz } from '../database/schemas';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: QuizFiltersDto): Promise<QuizListResult> {
    const { category, difficulty, page, limit } = filters;

    return this.quizzesService.findAll(
      { category, difficulty },
      { page, limit },
    );
  }

  @Get('categories')
  @HttpCode(HttpStatus.OK)
  async getCategories(): Promise<CategoriesResponseDto> {
    const categories = await this.quizzesService.getCategories();
    return { categories };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<PublicQuiz> {
    return this.quizzesService.findById(id);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async submitQuiz(
    @Param('id') id: string,
    @Body() submission: SubmitQuizDto,
    @Request() req: { user: { id: string } },
  ): Promise<QuizResultDto> {
    return this.quizzesService.submitQuiz(id, req.user.id, submission);
  }
}
