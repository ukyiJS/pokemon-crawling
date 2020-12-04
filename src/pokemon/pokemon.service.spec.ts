import { TypeormService } from '@/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { PokemonDatabase } from './model/pokemonDatabase.entity';
import { PokemonWiki } from './model/pokemonWiki.entity';
import { PokemonService } from './pokemon.service';

jest.setTimeout(100000);
describe('PokemonService', () => {
  let service: PokemonService;
  let pokemonDatabaseRepository: MongoRepository<PokemonDatabase>;
  let pokemonWikiRepository: MongoRepository<PokemonWiki>;

  beforeAll(async () => {
    await Test.createTestingModule({
      imports: [TypeOrmModule.forRootAsync({ useClass: TypeormService })],
      providers: [PokemonService, { provide: getRepositoryToken(PokemonDatabase), useClass: MongoRepository }],
    }).compile();

    pokemonWikiRepository = getMongoRepository(PokemonWiki);
    pokemonDatabaseRepository = getMongoRepository(PokemonDatabase);
    service = new PokemonService(pokemonWikiRepository, pokemonDatabaseRepository);
  });

  it.only('Pokemons of Wiki Test', async () => {
    const pokemons = await service.crawlingPokemonWiki();
    expect(pokemons).not.toHaveLength(0);
  });

  it('Pokemons of Database Test', async () => {
    const pokemons = await service.crawlingPokemonDatabase();
    expect(pokemons).not.toHaveLength(0);
  });

  it('Pokemon Images Test', async () => {
    const pokemons = await service.getPokemonImageOfSerebiiNet();
    expect(pokemons).not.toHaveLength(0);
  });
  it('Pokemon Icon Images Test', async () => {
    const pokemons = await service.crawlingPokemonIconImagOfSerebiiNet();
    expect(pokemons).not.toHaveLength(0);
  });
});
