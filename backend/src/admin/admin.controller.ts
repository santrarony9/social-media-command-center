import { Controller, Post, Body, Get, UseGuards, Delete, Param } from '@nestjs/common';
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

    @Delete('employees/:id')
    async deleteEmployee(@Param('id') id: string) {
        return this.adminService.deleteEmployee(id);
    }

    @Get('employees/:id') // Placeholder if needed in future
    async getEmployee(@Body() body: any) { return; }

    @UseGuards(JwtAuthGuard, RolesGuard) // Double check guard
    @Post('employees/delete/:id') // Using POST for safety if DELETE has issues, but standard is DELETE. Let's use DELETE.
    // actually, let's use the standard decorator
    async deleteEmployeeProxy(@Body() body: any) { return; }
    // Wait, let's do it cleanly.

    @Get('employees')
    async getEmployees() {
        return this.adminService.getAllEmployees();
    }

}
