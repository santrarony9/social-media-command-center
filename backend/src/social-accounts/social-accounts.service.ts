import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SocialAccountsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.SocialAccountUncheckedCreateInput) {
        return this.prisma.socialAccount.create({
            data,
        });
    }

    async findAll(clientId?: string) {
        const where: Prisma.SocialAccountWhereInput = clientId ? { clientId } : {};
        return this.prisma.socialAccount.findMany({
            where,
            include: {
                client: {
                    select: { id: true, name: true },
                },
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.socialAccount.findUnique({
            where: { id },
        });
    }

    async remove(id: string) {
        return this.prisma.socialAccount.delete({
            where: { id },
        });
    }
}
