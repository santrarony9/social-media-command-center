import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SeoService } from './seo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('seo')
@UseGuards(JwtAuthGuard)
export class SeoController {
    constructor(private readonly seoService: SeoService) { }

    @Post('generate-tags')
    generateTags(@Body() data: { industry: string; platform: string }) {
        return {
            hashtags: this.seoService.generateHashtags(data.industry, data.platform)
        };
    }

    @Post('optimize')
    optimize(@Body() data: { content: string; industry: string }) {
        return {
            optimizedContent: this.seoService.optimizeCaption(data.content, data.industry),
            keywords: this.seoService.generateKeywords(data.content)
        };
    }
}
