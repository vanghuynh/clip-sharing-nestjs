import { IsNotEmpty } from "class-validator";
import { UserRo } from "src/user/user.dto";

export class ClipDto {

    title: string;

    author: string;

    description: string;

    @IsNotEmpty()
    url: string;
}

export class ClipRo {
    id?: string;

    title: string;

    author: string;

    description: string;

    url: string;

    owner?: UserRo;

    created: Date;

    updated: Date;
}