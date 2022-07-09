import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, ParseUUIDPipe, UseGuards, Logger, Query } from '@nestjs/common';
import { ClipService } from './clip.service';
import { ClipDto, ClipRo } from './clip.dto';
import { Validation } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';

@Controller('clip')
export class ClipController {

    private logger = new Logger('ClipController');

    constructor(
        private clipService: ClipService,
    ) {

    }

    @Get('')
    showClips(@Query('page') page: number = 1, @Query('latest') latest: boolean = false, @Query('query') query: string = '') {
        return this.clipService.showAll(page, latest, query);
    }

    @Post('')
    @UsePipes(new Validation())
    @UseGuards(new AuthGuard())
    createClip(@User('id') userId, @Body() clip: ClipDto): Promise<any> {
        console.log("User Id: ", userId);
        this.logger.log(`UserId: ${userId}, Clip: ${clip} `, 'ClipController');
        return this.clipService.create(userId, clip);
    }

    @Get(':id')
    readClip(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.clipService.read(id);
    }

    @Put(':id')
    @UsePipes(new Validation())
    @UseGuards(new AuthGuard())
    updateClip(@User('id') userId, @Param("id") id: string, @Body() data: Partial<ClipDto>): Promise<ClipRo> {
        return this.clipService.update(id, userId, data);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    deleteClip(@User('id') userId, @Param("id") id: string) {
        return this.clipService.destroy(id, userId);
    }
}
