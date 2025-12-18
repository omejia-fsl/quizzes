import { Module } from '@nestjs/common';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { ScoringService } from './scoring.service';
import { AttemptsService } from '../attempts';

@Module({
  controllers: [QuizzesController],
  providers: [QuizzesService, ScoringService, AttemptsService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
