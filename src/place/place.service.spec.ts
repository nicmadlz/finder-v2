import { Test, TestingModule } from '@nestjs/testing';
import { PlaceService } from './place.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlaceEntity } from './place.entity';
import { AddressEntity } from 'src/address/address.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AppGateway } from 'src/gateway/app.gateway';

describe('PlaceService', () => {
  let placeService: PlaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaceService,
        {
          provide: getRepositoryToken(PlaceEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: AppGateway,
          useValue: {
            sendPlaceUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    placeService = module.get<PlaceService>(PlaceService);
  });

  it('must create a place', async () => {
    jest
      .spyOn(placeService['placeRepository'], 'findOne')
      .mockResolvedValue(null);

    jest.spyOn(placeService['placeRepository'], 'save').mockResolvedValue({
      id: 1,
      name: 'test',
      category: 'test',
      priceRange: 12,
      rating: 5,
      address: {
        id: 1,
        street: 'Test',
        number: 111,
        neighborhood: 'Centro',
        cep: 90440170,
      } as AddressEntity,
    });

    await expect(
      placeService.createPlace({
        name: 'test',
        category: 'test',
        priceRange: 12,
        rating: 5,
        address: {
          street: 'Test',
          number: 111,
          neighborhood: 'Centro',
          cep: 90440170,
        },
      }),
    ).resolves.toMatchObject({
      name: 'test',
      category: 'test',
      priceRange: 12,
      rating: 5,
      address: {
        street: 'Test',
        number: 111,
        neighborhood: 'Centro',
        cep: 90440170,
      },
    });
  });

  it('must return all places', async () => {
    jest
      .spyOn(placeService['placeRepository'], 'findAndCount')
      .mockResolvedValue([
        [
          {
            id: 1,
            name: 'test',
            category: 'test',
            priceRange: 12,
            rating: 5,
            address: {
              id: 1,
              street: 'Test',
              number: 111,
              neighborhood: 'Centro',
              cep: 90440170,
            } as AddressEntity,
          },
        ],
        1,
      ]);

    await expect(placeService.listPlaces(1, 10)).resolves.toMatchObject({
      data: [
        { id: 1, name: 'test', category: 'test', priceRange: 12, rating: 5 },
      ],
      total: 1,
      hasNext: false,
      page: 1,
      pageSize: 10,
    });
  });

  it('must find a place by id', async () => {
    jest.spyOn(placeService['placeRepository'], 'findOne').mockResolvedValue({
      id: 1,
      name: 'test',
      category: 'test',
      priceRange: 12,
      rating: 5,
    } as PlaceEntity);

    await expect(placeService.findPlace(1)).resolves.toMatchObject({
      id: 1,
      name: 'test',
      category: 'test',
      priceRange: 12,
      rating: 5,
    });
  });

  it('must update a place', async () => {
    jest.spyOn(placeService['placeRepository'], 'findOne').mockResolvedValue({
      id: 1,
      name: 'test',
      category: 'test',
      priceRange: 12,
      rating: 5,
    } as PlaceEntity);

    jest.spyOn(placeService['placeRepository'], 'save').mockResolvedValue({
      id: 1,
      name: 'test2',
      category: 'test',
      priceRange: 12,
      rating: 5,
    } as PlaceEntity);

    await expect(
      placeService.updatePlace(1, { name: 'test2' }),
    ).resolves.toMatchObject({
      id: 1,
      name: 'test2',
      category: 'test',
      priceRange: 12,
      rating: 5,
    });
  });

  it('must delete a place', async () => {
    jest.spyOn(placeService['placeRepository'], 'findOne').mockResolvedValue({
      id: 1,
      name: 'test',
      category: 'test',
      priceRange: 12,
      rating: 5,
    } as PlaceEntity);

    jest.spyOn(placeService['placeRepository'], 'remove').mockResolvedValue({
      id: 1,
      name: 'test',
      category: 'test',
      priceRange: 12,
      rating: 5,
    } as PlaceEntity);

    await expect(placeService.deletePlace(1)).resolves.toMatchObject({
      id: 1,
      name: 'test',
      category: 'test',
      priceRange: 12,
      rating: 5,
    });
  });

  it('must return NotFoundException', async () => {
    jest
      .spyOn(placeService['placeRepository'], 'findOne')
      .mockResolvedValue(null);

    await expect(placeService.findPlace(1)).rejects.toThrow(NotFoundException);
  });

  it('must return ConflictException', async () => {
    jest.spyOn(placeService['placeRepository'], 'findOne').mockResolvedValue({
      id: 1,
      name: 'test',
      category: 'test',
      priceRange: 12,
      rating: 5,
    } as PlaceEntity);

    jest.spyOn(placeService['placeRepository'], 'save').mockResolvedValue({
      id: 1,
      name: 'test',
      category: 'test',
      priceRange: 12,
      rating: 5,
    } as PlaceEntity);

    await expect(
      placeService.createPlace({
        name: 'test',
        category: 'test',
        priceRange: 12,
        rating: 5,
        address: {
          street: 'teste',
          number: 11,
          neighborhood: 'teste',
          cep: 123456789,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });
});
