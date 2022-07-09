import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { YoutubeClipRo } from './clip.dto';

@Injectable()
export class GoogleService {
    constructor(
        private httpService: HttpService,
        private configService: ConfigService
    ) {
    }

    getYoutubeClipInfo(url: string): Observable<AxiosResponse<YoutubeClipRo>> {
        const youtubeClipId = this.getYoutubeClipId(url);
        if (!youtubeClipId) {
            return null;
        }
        const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
        return this.httpService.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${youtubeClipId}&key=${apiKey}`);
    }

    private getYoutubeClipId(url: string): string {
        if (url.includes('https://www.youtube.com/watch')) {
            return url.split('?v=')[1];
        }
        if (url.includes('https://youtu.be')) {
            return url.split('.be/')[1];
        }
        return '';
    }
}
