import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';

jest.setTimeout(100000);
describe('PokemonService', () => {
  let service: PokemonService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonService],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
  });

  it.only('Pokemons of Database Test', async () => {
    const pokemons = await service.getPokemonsOfDatabase();
    expect(pokemons).not.toBeUndefined();
  });

  it('Evolution Test', async () => {
    const evolutions = await service.getEvolutionOfDatabase();
    expect(evolutions).not.toBeUndefined();
  });
});
