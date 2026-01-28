import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PostsService {
    constructor(
        private prisma: PrismaService,
        private httpService: HttpService
    ) { }

    async create(data: Prisma.PostUncheckedCreateInput) {
        // 1. Create Post in DB
        const post = await this.prisma.post.create({ data });

        // 2. Publish to Platforms (if not scheduled)
        if (!data.scheduledAt) {
            await this.publishToPlatforms(post);
        }

        return post;
    }

    async publishToPlatforms(post: any) {
        const platforms = post.platforms as string[];

        for (const platform of platforms) {
            try {
                // Find Social Account for this Client & Platform
                const account = await this.prisma.socialAccount.findFirst({
                    where: {
                        clientId: post.clientId,
                        platform: platform as any
                    }
                });

                if (!account) {
                    console.warn(`No connected account found for ${platform}`);
                    continue;
                }

                if (platform === 'FACEBOOK') {
                    await this.publishToFacebook(post, account);
                }
                // Add other platforms here...

            } catch (error) {
                console.error(`Failed to publish to ${platform}`, error);
            }
        }
    }

    async publishToFacebook(post: any, account: any) {
        const url = `https://graph.facebook.com/v19.0/${account.platformId}/feed`;
        const payload: any = {
            message: post.content,
            access_token: account.accessToken
        };

        // Handle Image/Video (Simplified: Just link for now if mediaUrl exists)
        // Ideally we use /photos endpoint, but /feed with link works for MVP
        if (post.mediaUrls && post.mediaUrls.length > 0) {
            // If it's a real URL, attach it. 
            // If Base64, we can't upload directly via Link to Graph API easily without Hosting.
            // For MVP Base64, we might fail here unless we upload to FB first.
            // Fallback: Just post text for now if Base64?
            // Correction: Graph API allows Base64? No. 
            // We will just post TEXT for now to prove connectivity.
        }

        const response = await firstValueFrom(this.httpService.post(url, payload));
        console.log('FB Response:', response.data);

        // Update Post with ID
        await this.prisma.post.update({
            where: { id: post.id },
            data: { status: 'PUBLISHED' }
        });
    }

    async findAll(clientId?: string, status?: string) {
        const where: Prisma.PostWhereInput = {};
        if (clientId) where.clientId = clientId;
        if (status) where.status = status as any;
        return this.prisma.post.findMany({
            where,
            include: {
                creator: {
                    select: { id: true, name: true, email: true },
                },
                client: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.post.findUnique({
            where: { id },
            include: {
                creator: true,
                client: true,
            },
        });
    }

    async update(id: string, data: Prisma.PostUpdateInput) {
        return this.prisma.post.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.post.delete({
            where: { id },
        });
    }

    async approve(id: string) {
        return this.prisma.post.update({
            where: { id },
            data: {
                status: 'APPROVED',
                approvalLog: { approvedAt: new Date() }
            },
        });
    }

    async reject(id: string, reason: string) {
        return this.prisma.post.update({
            where: { id },
            data: {
                status: 'REJECTED',
                approvalLog: { rejectedAt: new Date(), reason }
            },
        });
    }
}
