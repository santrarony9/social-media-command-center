import { Injectable } from '@nestjs/common';

@Injectable()
export class SeoService {
    private commonHashtags = {
        'Fashion': ['#FashionIndia', '#OOTDIndia', '#DesiSwag', '#StyleInspo', '#TrendingNow'],
        'Tech': ['#TechIndia', '#DigitalIndia', '#StartupLife', '#Innovation', '#Gadgets'],
        'Food': ['#FoodieIndia', '#DesiFood', '#StreetFoodIndia', '#Yummy', '#FoodPorn'],
        'Travel': ['#IncredibleIndia', '#TravelDiaries', '#Wanderlust', '#ExploreIndia'],
        'General': ['#India', '#Trending', '#Viral', '#Explore']
    };

    private trendingKeywords = ['Viral', 'New', 'Exclusive', 'MustWatch', 'India'];

    generateHashtags(industry: string | null, platform: string): string[] {
        const key = industry && this.commonHashtags[industry] ? industry : 'General';
        let tags = [...this.commonHashtags[key]];

        // Platform specific additions
        if (platform === 'LINKEDIN') {
            tags = tags.map(t => t.replace('#', '#Professional')); // Dummy logic for example
            tags.push('#Business', '#Growth', '#Career');
        } else if (platform === 'INSTAGRAM') {
            tags.push('#InstaDaily', '#IGers');
        } else if (platform === 'TWITTER') {
            // Twitter wants fewer tags
            return tags.slice(0, 3);
        }

        return tags;
    }

    generateKeywords(content: string): string[] {
        // Simple mock keyword extraction
        const words = content.split(' ').filter(w => w.length > 4);
        return [...new Set([...words, ...this.trendingKeywords])];
    }

    optimizeCaption(content: string, industry: string | null): string {
        const keywords = this.generateKeywords(content);
        return `${content}\n\nKeywords: ${keywords.join(', ')}`;
    }
}
