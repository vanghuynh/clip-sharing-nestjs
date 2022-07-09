import { IsNotEmpty } from "class-validator";
import { UserRo } from "src/user/user.dto";

export class ClipDto {

    title: string;

    author: string;

    description: string;

    @IsNotEmpty()
    url: string;

    thumbnail: string;
}

export class ClipRo {
    id?: string;

    title: string;

    author: string;

    description: string;

    url: string;

    thumbnail: string;

    owner?: UserRo;

    created: Date;

    updated: Date;
}

export class YoutubeClipRo {
    items: YoutubeClipItem[];
}

export class YoutubeClipItem {
    id: string;

    snippet: YoutubeClipItemSnippet;
}

export class YoutubeClipItemSnippet {
    title: string;

    description: string;

    thumbnails: {
        default: {
            url: string;
        }
    }
}