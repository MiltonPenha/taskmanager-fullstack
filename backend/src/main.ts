import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function normalizeOrigin(origin: string): string | null {
  const trimmedOrigin = origin.trim().replace(/\/+$/, '');

  if (!trimmedOrigin) {
    return null;
  }

  const originWithProtocol = /^https?:\/\//i.test(trimmedOrigin)
    ? trimmedOrigin
    : trimmedOrigin.includes('localhost') || trimmedOrigin.startsWith('127.')
      ? `http://${trimmedOrigin}`
      : `https://${trimmedOrigin}`;

  try {
    return new URL(originWithProtocol).origin;
  } catch {
    return null;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const allowedOrigins = (configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000')
    .split(',')
    .map(normalizeOrigin)
    .filter((origin): origin is string => Boolean(origin));

  app.enableCors({
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('PORT') ?? 3001;
  await app.listen(port);
}

void bootstrap();
