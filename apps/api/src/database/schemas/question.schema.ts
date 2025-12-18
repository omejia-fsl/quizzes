import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Answer, AnswerSchema } from './answer.schema';

@Schema({ _id: true })
export class Question {
  _id!: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  text!: string;

  @Prop({ type: String, required: true })
  explanation!: string;

  @Prop({ type: Number, required: true, min: 1 })
  order!: number;

  @Prop({ type: [AnswerSchema], required: true })
  answers!: Answer[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
