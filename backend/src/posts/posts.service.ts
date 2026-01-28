import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.PostUncheckedCreateInput) {
        return this.prisma.post.create({
            data,
        });
    }

    async findAll(clientId?: string) {
        const where: Prisma.PostWhereInput = clientId ? { clientId } : {};
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
}
