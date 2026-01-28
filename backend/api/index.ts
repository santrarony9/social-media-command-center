import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';

let app;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new ExpressAdapter());
    app.enableCors();
    await app.init();
    return app.getHttpAdapter().getInstance();
}

export default async function handler(req, res) {
    if (!app) {
        app = await bootstrap();
    }
    return app(req, res);
}
