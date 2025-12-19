import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Quiz } from '../schemas';
import { quizSeeds } from './quiz-seeds';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const quizModel = app.get<Model<Quiz>>(getModelToken(Quiz.name));

  console.log('Starting quiz seed...');

  try {
    const existingCount = await quizModel.countDocuments().exec();

    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing quizzes.`);
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise<string>((resolve) => {
        rl.question(
          'Do you want to delete existing quizzes and reseed? (yes/no): ',
          resolve,
        );
      });
      rl.close();

      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        console.log('Deleting existing quizzes...');
        await quizModel.deleteMany({}).exec();
        console.log('Deleted existing quizzes.');
      } else {
        console.log('Keeping existing quizzes. Exiting seed script.');
        await app.close();
        return;
      }
    }

    console.log(`Seeding ${quizSeeds.length} quizzes...`);

    for (const quizData of quizSeeds) {
      const quiz = new quizModel(quizData);
      await quiz.save();
      console.log(
        `✓ Seeded quiz: ${quiz.title} (${quiz.questions.length} questions)`,
      );
    }

    console.log('\n✅ Quiz seeding completed successfully!');
    console.log(
      `Total quizzes in database: ${await quizModel.countDocuments().exec()}`,
    );
  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
