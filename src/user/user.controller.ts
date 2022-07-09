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

@Controller('user')
export class UserController {

    constructor(private userService: UserService){

    }

    @Get('')
    @UseGuards(new AuthGuard())
    showAllUser(@User("username") user, @Query('page') page = 1, @Query('query') query?: string): Promise<any>{
        console.log("User: ", user);
        return this.userService.showAll(page, query);
    }

    @Post('login')
    @UsePipes(new Validation())
    login(@Body() data: UserDto): Promise<UserRo>{
        return this.userService.login(data);
    }

    @Post('register')
    @UsePipes(new Validation())
    register(@Body() data: UserDto): Promise<UserRo>{
        return this.userService.register(data);
    }


    @Post('')
    @UsePipes(new Validation())
    @UseGuards(new AuthGuard())
    createUser(@Body() userDto: UserDto): Promise<UserRo>{
        userDto.password = '1234'
        return this.userService.register(userDto);
    }

    @Get(':id')
    readUser(@Param("id", new ParseUUIDPipe()) id: string){
        return this.userService.read(id);
    }

    @Put(':id')
    @UsePipes(new Validation())
    //@UseGuards(new AuthGuard())
    updateUser(@Param("id") id: string, @Body() data: Partial<UserDto>): Promise<UserRo>{
        return this.userService.update(id, data);
    }

    @Delete(':id')
    //@UseGuards(new AuthGuard())
    deleteUser(@Param("id") id: string ){
        return this.userService.destroy(id);
    }
}
