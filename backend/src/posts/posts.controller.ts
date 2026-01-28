import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    create(@Request() req: any, @Body() createPostDto: { content: string; clientId: string; mediaUrls?: string[], scheduledAt?: string }) {
        return this.postsService.create({
            content: createPostDto.content,
            clientId: createPostDto.clientId,
            creatorId: req.user.userId, // Taken from JWT
            mediaUrls: createPostDto.mediaUrls || [],
            scheduledAt: createPostDto.scheduledAt ? new Date(createPostDto.scheduledAt) : null,
            status: createPostDto.scheduledAt ? 'SCHEDULED' : 'DRAFT',
        });
    }

    @Get()
    findAll(@Query('clientId') clientId?: string) {
        return this.postsService.findAll(clientId);
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
