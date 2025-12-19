import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: true })
export class AttemptAnswer {
  _id!: Types.ObjectId;

  @Prop({ type: String, required: true })
  questionId!: string;

  @Prop({ type: String, required: true })
  answerId!: string;

  @Prop({ type: Boolean, required: true })
  isCorrect!: boolean;
}

export const AttemptAnswerSchema = SchemaFactory.createForClass(AttemptAnswer);
