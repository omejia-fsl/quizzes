import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AttemptAnswer, AttemptAnswerSchema } from './attempt-answer.schema';

@Schema({ timestamps: true })
export class QuizAttempt {
  @Prop({ type: String, required: true, index: true })
  userId!: string;

  @Prop({ type: String, required: true, index: true })
  quizId!: string;

  @Prop({ type: String, required: true })
  quizTitle!: string;

  @Prop({ type: Number, required: true, min: 0 })
  score!: number;

  @Prop({ type: Number, required: true, min: 1 })
  totalQuestions!: number;

  @Prop({ type: Number, required: true, min: 0, max: 100 })
  percentage!: number;

  @Prop({
    type: String,
    required: true,
    enum: ['excellent', 'good', 'needs_improvement', 'keep_practicing'],
  })
  feedbackLevel!: string;

  @Prop({ type: String, required: true })
  feedbackMessage!: string;

  @Prop({ type: Number, required: false, min: 0 })
  timeSpentSeconds?: number;

  @Prop({ type: [AttemptAnswerSchema], required: true })
  answers!: Types.DocumentArray<AttemptAnswer>;

  createdAt!: Date;
  updatedAt!: Date;
}

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttempt);

QuizAttemptSchema.index({ userId: 1, createdAt: -1 });
QuizAttemptSchema.index({ quizId: 1, createdAt: -1 });
QuizAttemptSchema.index({ userId: 1, quizId: 1, createdAt: -1 });

export type QuizAttemptDocument = QuizAttempt &
  Document & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };
