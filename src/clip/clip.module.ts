import { Module } from '@nestjs/common';
import { ClipController } from './clip.controller';
import { ClipService } from './clip.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClipEntity } from 'src/clip/clip.entity';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClipEntity, UserEntity])],
  controllers: [ClipController],
  providers: [ClipService]
})
export class ClipModule { }
