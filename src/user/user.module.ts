import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from './user.entity';
import {LoginController} from "./login.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController, LoginController],
  providers: [UserService]
})
export class UserModule {}
