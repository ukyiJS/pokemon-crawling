import { configOptions, TypeormService } from '@/config';
import { ConvertModule, getJson, PuppeteerModule } from '@/utils';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlingModule } from './crawling/crawling.module';
import { PokemonDatabase } from './model/pokemonDatabase.entity';
import { PokemonWiki } from './model/pokemonWiki.entity';
import { SerebiiNet } from './model/serebiiNet.entity';
import { PokemonService } from './pokemon.service';

jest.setTimeout(100000);
describe('PokemonService', () => {
  let service: PokemonService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configOptions),
        TypeOrmModule.forRootAsync({ useClass: TypeormService }),
        TypeOrmModule.forFeature([PokemonWiki, PokemonDatabase]),
        PuppeteerModule,
        ConvertModule,
        CrawlingModule,
      ],
      providers: [PokemonService],
    }).compile();

    service = await moduleRef.resolve(PokemonService);
  });

  describe('pokemonDatabase Test', () => {
    const pokemonDatabase = getJson<PokemonDatabase[]>({ fileName: 'pokemonDatabase.json' });

    it('should return an array of crawlingPokemonDatabase', async () => {
      const pokemons = await service.crawlingPokemonDatabase();
      expect(pokemons).not.toHaveLength(0);
    });

    it('should return an array of getPokemonOfPokemonDatabase', async () => {
      const pokemons = await service.getPokemonOfPokemonDatabase();
      expect(pokemons).not.toHaveLength(0);
    });

    it('should return an array of updateImageOfPokemonDatabase', async () => {
      const result = await service.downloadPokemonImageOfSerebiiNet(pokemonDatabase);
      expect(result).toEqual(true);
    });

    it('should return an array of downloadPokemonIconImageOfSerebiiNet', async () => {
      const result = await service.downloadPokemonIconImageOfSerebiiNet(pokemonDatabase);
      expect(result).toEqual(true);
    });

    it('should return an array of updateImageOfPokemonDatabase', async () => {
      const result = await service.updateImageOfPokemonDatabase(pokemonDatabase);
      expect(result).not.toBeNull();
      expect(result).not.toHaveLength(0);
    });

    it('should return an array of updateIconImageOfPokemonDatabase', async () => {
      const result = await service.updateIconImageOfPokemonDatabase(pokemonDatabase);
      expect(result).not.toBeNull();
      expect(result).not.toHaveLength(0);
    });

    it('should return an array of updatePokemonAbilities', async () => {
      const result = await service.updatePokemonAbilities(pokemonDatabase);
      expect(result).not.toBeNull();
      expect(result).not.toHaveLength(0);
    });

    it('should return an array of updatePokemonEggGroups', async () => {
      const result = await service.updatePokemonEggGroups(pokemonDatabase);
      expect(result).not.toBeNull();
      expect(result).not.toHaveLength(0);
    });

    it('should return an array of updatePokemonEvolutionCondition', async () => {
      const result = await service.updatePokemonEvolutionCondition(pokemonDatabase);
      expect(result).not.toBeNull();
      expect(result).not.toHaveLength(0);
    });

    it('should return an array of updatePokemonForm', async () => {
      const result = await service.updatePokemonForm(pokemonDatabase);
      expect(result).not.toBeNull();
      expect(result).not.toHaveLength(0);
    });

    it('should return an array of updatePokemonName', async () => {
      const result = await service.updatePokemonName(pokemonDatabase);
      expect(result).not.toBeNull();
      expect(result).not.toHaveLength(0);
    });

    it('should return an array of updatePokemonSpecies', async () => {
      const result = await service.updatePokemonSpecies(pokemonDatabase);
      expect(result).not.toBeNull();
      expect(result).not.toHaveLength(0);
    });

    it('should return an array of updatePokemonTypes', async () => {
      const result = await service.updatePokemonTypes(pokemonDatabase);
      expect(result).not.toBeNull();
      expect(result).not.toHaveLength(0);
    });
  });

  describe('pokemonWiki Test', () => {
    const pokemonWiki = getJson<PokemonWiki[]>({ fileName: 'pokemonWiki.json' });

    it('should return an array of crawlingPokemonWiki', async () => {
      const pokemons = await service.crawlingPokemonWiki();
      expect(pokemons).not.toHaveLength(0);
    });

    it('should return an array of getPokemonOfPokemonWiki', async () => {
      const pokemons = await service.getPokemonOfPokemonWiki();
      expect(pokemons).not.toHaveLength(0);
    });

    it('should return an array of downloadPokemonImageOfWiki', async () => {
      const pokemons = await service.downloadPokemonImageOfWiki(pokemonWiki);
      expect(pokemons).toEqual(true);
    });
  });
});
