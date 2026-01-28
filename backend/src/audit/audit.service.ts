import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async logAction(userId: string, action: string, details?: any, ipAddress?: string, resource?: string) {
        return this.prisma.auditLog.create({
            data: {
                userId,
                action,
                details: details || {},
                ipAddress,
                resource,
            },
        });
    }

    async getLogs(limit: number = 50) {
        return this.prisma.auditLog.findMany({
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true, role: true },
                },
            },
        });
    }
}
