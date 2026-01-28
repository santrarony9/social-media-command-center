import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SocialAccountsService } from './social-accounts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SocialPlatform } from '@prisma/client';

@Controller('social-accounts')
@UseGuards(JwtAuthGuard)
export class SocialAccountsController {
    constructor(private readonly socialAccountsService: SocialAccountsService) { }

    @Post()
    create(@Body() createDto: {
        platform: SocialPlatform;
        platformId: string;
        accessToken: string;
        profileName: string;
        clientId: string;
    }) {
        return this.socialAccountsService.create({
            platform: createDto.platform,
            platformId: createDto.platformId,
            accessToken: createDto.accessToken,
            profileName: createDto.profileName,
            clientId: createDto.clientId,
        });
    }

    @Get()
    findAll(@Query('clientId') clientId?: string) {
        return this.socialAccountsService.findAll(clientId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.socialAccountsService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.socialAccountsService.remove(id);
    }
}
