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

  it('evolutionChainByLevel', async () => {
    const evolutionChainByLevel = await service.getEvolutionChainByLevel();
    expect(evolutionChainByLevel).not.toBeUndefined();
  });
});
