import { TypeormService } from '@/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { PokemonOfDatabase } from './model/pokemonOfDatabase.entity';
import { PokemonOfWiki } from './model/pokemonOfWiki.entity';
import { PokemonService } from './pokemon.service';

jest.setTimeout(100000);
describe('PokemonService', () => {
  let service: PokemonService;
  let pokemonOfDatabaseRepository: MongoRepository<PokemonOfDatabase>;
  let pokemonOfWikiRepository: MongoRepository<PokemonOfWiki>;

  beforeAll(async () => {
    await Test.createTestingModule({
      imports: [TypeOrmModule.forRootAsync({ useClass: TypeormService })],
      providers: [PokemonService, { provide: getRepositoryToken(PokemonOfDatabase), useClass: MongoRepository }],
    }).compile();

    pokemonOfDatabaseRepository = getMongoRepository(PokemonOfDatabase);
    pokemonOfWikiRepository = getMongoRepository(PokemonOfWiki);
    service = new PokemonService(pokemonOfDatabaseRepository,pokemonOfWikiRepository);
  });

  it.only('Pokemons of Wiki Test', async () => {
    const pokemons = await service.getPokemonsOfWiki();
    expect(pokemons).not.toHaveLength(0);
  });

  it('Pokemons of Database Test', async () => {
    const pokemons = await service.getPokemonsOfDatabase();
    expect(pokemons).not.toHaveLength(0);
  });

  it('Pokemon Images Test', async () => {
    const pokemons = await service.getPokemonImagesOfSerebiiNet();
    expect(pokemons).not.toHaveLength(0);
  });
  it('Pokemon Icon Images Test', async () => {
    const pokemons = await service.getPokemonIconImagesOfSerebiiNet();
    expect(pokemons).not.toHaveLength(0);
  });
});
