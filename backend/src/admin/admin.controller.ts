import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Post('employees')
    async createEmployee(@Body() body: { email: string; password: string; name: string; jobTitle: string }) {
        return this.adminService.createEmployee(body);
    }

    @Get('employees')
    async getEmployees() {
        return this.adminService.getAllEmployees();
    }

    @Post('assign')
    async assignClient(@Body() body: { userId: string; clientId: string; permissionLevel: any }) {
        return this.adminService.assignClient(body);
    }
}
