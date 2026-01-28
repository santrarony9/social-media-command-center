import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { PostsModule } from './posts/posts.module';
import { SocialAccountsModule } from './social-accounts/social-accounts.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ClientsModule, PostsModule, SocialAccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
