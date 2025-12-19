import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: true })
export class Answer {
  _id!: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  text!: string;

  @Prop({ type: Boolean, required: true, default: false })
  isCorrect!: boolean;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
