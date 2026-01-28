import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async createEmployee(data: { email: string; password: string; name: string; jobTitle: string }) {
        // Check if user exists
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await argon2.hash(data.password);

        return this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: 'EMPLOYEE',
                jobTitle: data.jobTitle,
                isActive: true,
            },
            select: { id: true, email: true, name: true, role: true, jobTitle: true },
        });
    }

    async assignClient(data: { userId: string; clientId: string; permissionLevel: 'FULL_ACCESS' | 'CONTENT_ONLY' | 'ANALYTICS_ONLY' | 'NONE' }) {
        // Verify existence
        const user = await this.prisma.user.findUnique({ where: { id: data.userId } });
        const client = await this.prisma.client.findUnique({ where: { id: data.clientId } });

        if (!user || !client) {
            throw new NotFoundException('User or Client not found');
        }

        return this.prisma.clientAccess.upsert({
            where: {
                userId_clientId: {
                    userId: data.userId,
                    clientId: data.clientId,
                },
            },
            update: {
                permissionLevel: data.permissionLevel,
            },
            create: {
                userId: data.userId,
                clientId: data.clientId,
                permissionLevel: data.permissionLevel,
            },
        });
    }

    async getAllEmployees() {
        return this.prisma.user.findMany({
            where: { role: 'EMPLOYEE' },
            select: { id: true, name: true, email: true, jobTitle: true, isActive: true },
        });
    }
}
