import { Module } from '@nestjs/common';
import { ClipController } from './clip.controller';
import { ClipService } from './clip.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClipEntity } from 'src/clip/clip.entity';
import { UserEntity } from 'src/user/user.entity';
import { GoogleService } from './google.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClipEntity, UserEntity]),
    ConfigModule,
    HttpModule,
  ],
  controllers: [ClipController],
  providers: [ClipService, GoogleService]
})
export class ClipModule { }
