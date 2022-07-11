import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { ClipController } from './clip.controller';
import { ClipEntity } from './clip.entity';
import { ClipService } from "./clip.service";
import { GoogleService } from './google.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

describe('ClipController', () => {
  let clipController: ClipController;
  let clipService: ClipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        HttpModule,
      ],
      controllers: [ClipController],
      providers: [
        ClipService,
        GoogleService,
        {
          provide: getRepositoryToken(ClipEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        }
      ]
    }).compile();

    clipController = module.get<ClipController>(ClipController);
    clipService = module.get<ClipService>(ClipService);
  });

  it('should be defined', () => {
    expect(clipController).toBeDefined();
  });

  it('should showAll return with not empty data', async () => {
    const nowDate = new Date();
    const searchResult = {
      total: 1,
      data: [
        {
          author: "author",
          created: nowDate,
          description: "the description",
          id: "a47ecdc2-77d6-462f-9045-c440c5e4616f",
          owner: null,
          thumbnail: "link-to-imgae",
          title: "the title",
          updated: nowDate,
          url: "url-test",
        }
      ]
    };
    // notice we are pulling the repo variable and using jest.spyOn with no issues
    jest.spyOn(clipService, 'showAll').mockResolvedValueOnce(searchResult);
    expect(await clipService.showAll()).toEqual(searchResult);
  });

});
