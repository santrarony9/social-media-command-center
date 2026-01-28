import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule, HttpModule],
    controllers: [PostsController],
    providers: [PostsService],
    exports: [PostsService],
})
export class PostsModule { }
