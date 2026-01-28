import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.ClientCreateInput) {
        return this.prisma.client.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.client.findMany({
            include: {
                _count: {
                    select: { posts: true, socialAccounts: true },
                },
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.client.findUnique({
            where: { id },
            include: {
                socialAccounts: true,
                posts: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }

    async update(id: string, data: Prisma.ClientUpdateInput) {
        return this.prisma.client.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.client.delete({
            where: { id },
        });
    }
}
