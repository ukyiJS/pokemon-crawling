import { TypeormService } from '@/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { PokemonOfDatabase } from './model/pokemonOfDatabase.entity';
import { PokemonService } from './pokemon.service';

jest.setTimeout(100000);
describe('PokemonService', () => {
  let service: PokemonService;
  let repository: MongoRepository<PokemonOfDatabase>;

  beforeAll(async () => {
    await Test.createTestingModule({
      imports: [TypeOrmModule.forRootAsync({ useClass: TypeormService })],
      providers: [PokemonService, { provide: getRepositoryToken(PokemonOfDatabase), useClass: MongoRepository }],
    }).compile();

    repository = getMongoRepository(PokemonOfDatabase);
    service = new PokemonService(repository);
  });

  it.only('Pokemons of Database Test', async () => {
    const pokemons = await service.getPokemonsOfDatabase();
    expect(pokemons).not.toBeUndefined();
  });

  it('Pokemon Icon Images Test', async () => {
    const iconImages = await service.getPokemonIconImagesOfSerebiiNet();
    expect(iconImages).not.toBeUndefined();
  });
});
