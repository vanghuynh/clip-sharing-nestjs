import { Test, TestingModule } from '@nestjs/testing';
import { ClipService } from './clip.service';
import { Repository } from "typeorm";
import { GoogleService } from "./google.service";
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClipEntity } from './clip.entity';
import { UserEntity } from '../user/user.entity';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

describe('ClipService', () => {
  let clipService: ClipService;
  let clipRepository: Repository<ClipEntity>;
  let googleService: GoogleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        HttpModule,
      ],
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
      ],
    }).compile();

    clipService = module.get<ClipService>(ClipService);
    googleService = module.get<GoogleService>(GoogleService);
    clipRepository = module.get<Repository<ClipEntity>>(getRepositoryToken(ClipEntity));
  });

  it('should be defined', () => {
    expect(clipRepository).toBeDefined();
    expect(clipService).toBeDefined();
    expect(googleService).toBeDefined();
  });

  it('should return data not empty for showAll', async () => {
    const nowDate = new Date();
    const clips: ClipEntity[] = [{
      id: 'a47ecdc2-77d6-462f-9045-c440c5e4616f',
      title: 'the title',
      author: 'author',
      description: 'the description',
      url: 'url-test',
      thumbnail: 'link-to-imgae',
      owner: null,
      created: nowDate,
      updated: nowDate,
    }];
    // notice we are pulling the repo variable and using jest.spyOn with no issues
    jest.spyOn(clipRepository, 'findAndCount').mockResolvedValueOnce([clips, clips.length]);
    expect(await clipService.showAll()).toEqual({
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
    });
  });

  it('should return empty data for showAll', async () => {
    const clips: ClipEntity[] = [];
    // notice we are pulling the repo variable and using jest.spyOn with no issues
    jest.spyOn(clipRepository, 'findAndCount').mockResolvedValueOnce([clips, clips.length]);
    expect(await clipService.showAll()).toEqual({
      total: 0,
      data: []
    });
    // change some data to test
  });
});
