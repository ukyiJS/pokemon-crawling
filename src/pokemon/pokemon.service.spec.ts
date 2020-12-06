import { envConfig, TypeormService } from '@/config';
import { ConvertModule, PuppeteerModule, validationSchema } from '@/utils';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlingModule } from './crawling/crawling.module';
import { PokemonDatabase } from './model/pokemonDatabase.entity';
import { PokemonWiki } from './model/pokemonWiki.entity';
import { PokemonService } from './pokemon.service';

jest.setTimeout(100000);
describe('PokemonService', () => {
  let service: PokemonService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod',
          load: [envConfig],
          validationSchema,
          validationOptions: { abortEarly: true },
        }),
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

  it.only('Pokemons of Wiki Test', async () => {
    const pokemons = await service.crawlingPokemonWiki();
    expect(pokemons).not.toHaveLength(0);
  });

  it('Pokemons of Database Test', async () => {
    const pokemons = await service.crawlingPokemonDatabase();
    expect(pokemons).not.toHaveLength(0);
  });

  it('Pokemon Images Test', async () => {
    const pokemons = await service.crawlingPokemonImageOfSerebiiNet();
    expect(pokemons).not.toHaveLength(0);
  });
  it('Pokemon Icon Images Test', async () => {
    const pokemons = await service.crawlingPokemonIconImagOfSerebiiNet();
    expect(pokemons).not.toHaveLength(0);
  });
});
