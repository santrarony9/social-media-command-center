import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    create(@Request() req: any, @Body() createPostDto: {
        content: string;
        clientId: string;
        mediaUrls?: string[];
        mediaType?: string;
        platforms?: string[];
        scheduledAt?: string
    }) {
        const isSuperAdmin = req.user.role === 'SUPER_ADMIN';
        // Auto-approve for Admins, otherwise Pending
        let status = 'DRAFT';
        if (createPostDto.scheduledAt) {
            status = isSuperAdmin ? 'SCHEDULED' : 'PENDING_APPROVAL';
        }

        return this.postsService.create({
            content: createPostDto.content,
            clientId: createPostDto.clientId,
            creatorId: req.user.userId,
            mediaUrls: createPostDto.mediaUrls || [],
            mediaType: createPostDto.mediaType || 'TEXT',
            platforms: (createPostDto.platforms as any) || [],
            scheduledAt: createPostDto.scheduledAt ? new Date(createPostDto.scheduledAt) : null,
            status: status as any,
        });
    }

    @Patch(':id/approve')
    @UseGuards(RolesGuard)
    @Roles('SUPER_ADMIN')
    approve(@Param('id') id: string) {
        return this.postsService.approve(id);
    }

    @Patch(':id/reject')
    @UseGuards(RolesGuard)
    @Roles('SUPER_ADMIN')
    reject(@Param('id') id: string, @Body('reason') reason: string) {
        return this.postsService.reject(id, reason);
    }

    @Get()
    findAll(@Query('clientId') clientId?: string, @Query('status') status?: string) {
        return this.postsService.findAll(clientId, status);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePostDto: any) {
        return this.postsService.update(id, updatePostDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.postsService.remove(id);
    }
}
