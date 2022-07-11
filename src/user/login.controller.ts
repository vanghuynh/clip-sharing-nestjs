import {
    Controller,
    Post,
    Get,
    Body,
    UsePipes,
    UseGuards,
    Query,
    Param,
    ParseUUIDPipe,
    Put,
    Delete
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto, UserRo } from './user.dto';
import { Validation } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from './user.decorator';

@Controller('public')
export class LoginController {

    constructor(private userService: UserService) {

    }

    @Post('login')
    @UsePipes(new Validation())
    login(@Body() data: UserDto): Promise<UserRo> {
        return this.userService.login(data);
    }

}
