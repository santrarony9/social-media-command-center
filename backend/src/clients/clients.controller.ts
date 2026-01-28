import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    @Post()
    create(@Body() createClientDto: { name: string; industry?: string; timezone?: string }) {
        return this.clientsService.create({
            name: createClientDto.name,
            industry: createClientDto.industry,
            timezone: createClientDto.timezone || 'UTC',
        });
    }

    @Get()
    findAll() {
        return this.clientsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.clientsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateClientDto: { name?: string; industry?: string; timezone?: string }) {
        return this.clientsService.update(id, updateClientDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.clientsService.remove(id);
    }
}
