import { ImageUtil } from '@/utils';
import { ConvertService } from '@/utils/convert/convert.service';
import { PuppeteerService } from '@/utils/puppeteer/puppeteer.service';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CrawlingService } from './crawling/crawling.service';
import { IPokemonDatabase } from './interfaces/pokemonDatabase.interface';
import { IPokemonWiki } from './interfaces/pokemonWiki.interface';
import { PokemonDatabase } from './model/pokemonDatabase.entity';
import { PokemonWiki } from './model/pokemonWiki.entity';
import { SerebiiNet } from './model/serebiiNet.entity';

@Injectable()
export class PokemonService {
  @InjectRepository(PokemonWiki)
  private readonly pokemonWiKiRepository: MongoRepository<PokemonWiki>;
  @InjectRepository(PokemonDatabase)
  private readonly pokemonDatabaseRepository: MongoRepository<PokemonDatabase>;
  @Inject(PuppeteerService)
  private readonly puppeteerService: PuppeteerService;
  @Inject(ConvertService)
  private readonly convertService: ConvertService;
  @Inject(CrawlingService)
  private readonly crawlingService: CrawlingService;

  public crawlingPokemonWiki = async (): Promise<IPokemonWiki[]> => {
    const { browser, page } = await this.puppeteerService.init('https://pokemon.fandom.com/ko/wiki/이상해씨');
    const pokemons = await this.crawlingService.crawlingPokemonWiki(page);
    await browser.close();

    return pokemons;
  };

  public crawlingPokemonDatabase = async (): Promise<IPokemonDatabase[]> => {
    const { browser, page } = await this.puppeteerService.init('https://pokemondb.net/pokedex/bulbasaur');
    const pokemons = await this.crawlingService.crawlingPokemonDatabase(page);
    await browser.close();

    return pokemons;
  };

  public crawlingPokemonIconImageOfSerebiiNet = async (): Promise<SerebiiNet[]> => {
    const { browser, page } = await this.puppeteerService.init('https://serebii.net/pokemon/nationalpokedex.shtml');
    const pokemonIconImages = await this.crawlingService.crawlingPokemonIconImageOfSerebiiNet(page);
    await browser.close();

    return pokemonIconImages;
  };

  public crawlingPokemonImageOfSerebiiNet = async (): Promise<SerebiiNet[]> => {
    const { browser, page } = await this.puppeteerService.init('https://serebii.net/pokemon/bulbasaur');
    const pokemonImages = await this.crawlingService.crawlingPokemonImageOfSerebiiNet(page);
    await browser.close();

    return pokemonImages;
  };

  public addPokemonWiki = async (pokemons: PokemonWiki[] | null): Promise<PokemonWiki[] | null> => {
    if (!pokemons) return null;

    const savedPokemons = pokemons.map(pokemon => this.pokemonWiKiRepository.save(new PokemonWiki(pokemon)));
    return Promise.all(savedPokemons);
  };

  public addPokemonDatabase = async (pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> => {
    if (!pokemons) return null;

    const savedPokemons = pokemons.map(pokemon => this.pokemonDatabaseRepository.save(new PokemonDatabase(pokemon)));
    const savedResult = await Promise.all(savedPokemons);

    const updatedPokemons = await this.updateIconImageOfPokemonDatabase(savedResult)
      .then(result => this.updateImageOfPokemonDatabase(result))
      .then(result => this.updatePokemonName(result))
      .then(result => this.updatePokemonTypes(result))
      .then(result => this.updatePokemonSpecies(result))
      .then(result => this.updatePokemonAbilities(result))
      .then(result => this.updatePokemonEggGroups(result))
      .then(result => this.updatePokemonForm(result))
      .then(result => this.updatePokemonEvolutionCondition(result))
      .then(result => this.updatePokemonEvYield(result))
      .then(result => {
        this.addPokemonColorOfPokemonDatabase();
        return this.addPokemonDynamax(result);
      });

    const updatedResult = updatedPokemons!.map(({ no, ...pokemon }) => {
      return this.pokemonDatabaseRepository
        .findOneAndUpdate({ no }, { $set: pokemon }, { returnOriginal: false })
        .then(({ value: pokemon }) => <PokemonDatabase>pokemon);
    });
    return Promise.all(updatedResult);
  };

  public addPokemonColorOfPokemonDatabase = async (): Promise<PokemonDatabase[] | null> => {
    const pokemons = await this.getPokemonOfPokemonWiki();
    if (!pokemons.length) return null;

    const updatedResult = pokemons.map(({ no, color }) => {
      return this.pokemonDatabaseRepository
        .findOneAndUpdate({ no }, { $set: { color } }, { returnOriginal: false })
        .then(({ value: pokemon }) => <PokemonDatabase>pokemon);
    });

    return Promise.all(updatedResult);
  };

  public addPokemonDynamax = async (pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> => {
    if (!pokemons?.length) return null;

    const pokemonWiki = await this.getPokemonOfPokemonWiki();
    const { getGenerationName, getImageUrl } = new ImageUtil();
    return pokemons.map(p => {
      const dynamax = pokemonWiki.find(({ no, differentForm }) => p.no === no && differentForm?.some(p => p.form === '거다이맥스'));
      if (!dynamax?.no) return p;
      const image = getImageUrl(`${getGenerationName(+p.no)}/${p.no}-dynamax`);
      const { stats, types, typeDefenses, species, evYield, eggCycle, eegGroups, catchRate, exp, friendship, abilities, hiddenAbility } = p;
      const pokemon = { stats, types, typeDefenses, species, evYield, eggCycle, eegGroups, catchRate, exp, friendship, abilities, hiddenAbility };
      return { ...p, differentForm: [...(p.differentForm ?? []), { ...dynamax, ...pokemon, image, form: '거다이맥스' }] };
    });
  };

  public getPokemonOfPokemonWiki = async (): Promise<PokemonWiki[]> => this.pokemonWiKiRepository.find({ order: { no: 'ASC' } });

  public async getPokemonOfPokemonDatabase(): Promise<PokemonDatabase[]> {
    return this.pokemonDatabaseRepository.find({
      order: { no: 'ASC' },
      cache: true,
    });
  }

  public downloadPokemonImageOfSerebiiNet = async (pokemonImages: SerebiiNet[] | null): Promise<boolean> => {
    if (!pokemonImages) return false;

    const { convertImageToDownload, multiDownloads } = new ImageUtil();
    const imagesToDownload = convertImageToDownload(pokemonImages, 'serebiiNet', true);
    await multiDownloads(imagesToDownload);

    return true;
  };

  public downloadPokemonIconImageOfSerebiiNet = async (pokemonImages: SerebiiNet[] | null): Promise<boolean> => {
    if (!pokemonImages) return false;

    const { convertImageToDownload, multiDownloads } = new ImageUtil();
    const imagesToDownload = convertImageToDownload(pokemonImages, 'serebiiNet/icon');
    await multiDownloads(imagesToDownload);

    return true;
  };

  public downloadPokemonImageOfPokemonWiki = async (pokemons: PokemonWiki[] | null): Promise<boolean> => {
    if (!pokemons) return false;

    const pokemonImages = <SerebiiNet[]>pokemons.map(({ no, name, image, form, differentForm }) => ({
      no,
      name,
      image,
      form,
      differentForm: differentForm?.map(({ no, name, image, form }) => ({ no, name, image, form })),
    }));
    const { convertImageToDownload, multiDownloads } = new ImageUtil();
    const imagesToDownload = convertImageToDownload(pokemonImages, 'wiki', true);
    await multiDownloads(imagesToDownload);

    return true;
  };

  public updateImageOfPokemonDatabase = async (pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> => {
    if (!pokemons) return null;

    const { updatePokemonImages } = new ImageUtil();
    return updatePokemonImages(pokemons);
  };

  public updateIconImageOfPokemonDatabase = async (pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> => {
    if (!pokemons) return null;

    const { updatePokemonIconImages } = new ImageUtil();
    return updatePokemonIconImages(pokemons);
  };

  public updatePokemonName = async (pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> => {
    if (!pokemons) return null;

    return this.convertService.convertPokemonName(pokemons);
  };

  public updatePokemonTypes = async (pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> => {
    if (!pokemons) return null;

    return this.convertService.convertPokemonTypes(pokemons);
  };

  public updatePokemonSpecies = async (pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> => {
    if (!pokemons) return null;

    return this.convertService.convertPokemonSpecies(pokemons);
  };

  public updatePokemonAbilities = async (pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> => {
    if (!pokemons) return null;

    return this.convertService.convertPokemonAbilities(pokemons);
  };

  public updatePokemonEggGroups = async (pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> => {
    if (!pokemons) return null;

    return this.convertService.convertPokemonEggGroups(pokemons);
  };

  public updatePokemonForm = async (pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> => {
    if (!pokemons) return null;

    return this.convertService.convertPokemonForm(pokemons);
  };

  public updatePokemonEvolutionCondition = async (pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> => {
    if (!pokemons) return null;

    return this.convertService.convertPokemonEvolutionCondition(pokemons);
  };

  public updatePokemonEvYield = async (pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> => {
    if (!pokemons) return null;

    return this.convertService.convertPokemonEvYield(pokemons);
  };
}
