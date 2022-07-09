import { IsNotEmpty } from "class-validator";
import { ClipRo } from "src/clip/clip.dto";

export class UserDto {

    @IsNotEmpty()
    username: string;

    password: string;

    firstName: string;

    lastName: string;

    role: string;

    email: string;
}

export class UserRo {
    id: string;
    username: string;
    created: Date;
    token?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    email?: string;
    clips?: ClipRo[];
}
