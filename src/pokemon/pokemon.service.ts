import { ImageUtil } from '@/utils';
import { ConvertService } from '@/utils/convert/convert.service';
import { PuppeteerService } from '@/utils/puppeteer/puppeteer.service';
import { Injectable } from '@nestjs/common';
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
  private readonly puppeteerService: PuppeteerService;
  private readonly convertService: ConvertService;
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

  public crawlingPokemonIconImagOfSerebiiNet = async (): Promise<SerebiiNet[]> => {
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
      .then(result => this.updatePokemonEvolutionCondition(result));

    const updatedResult = updatedPokemons!.map(({ no, ...pokemon }) => {
      return this.pokemonDatabaseRepository
        .findOneAndUpdate({ no }, { $set: pokemon }, { returnOriginal: false })
        .then(({ value: pokemon }) => <PokemonDatabase>pokemon);
    });
    return Promise.all(updatedResult);
  };

  public async getPokemonOfPokemonWiki(): Promise<PokemonWiki[]> {
    return this.pokemonWiKiRepository.find({
      order: { no: 'ASC' },
    });
  }

  public async getPokemonOfPokemonDatabase(): Promise<PokemonDatabase[]> {
    return this.pokemonDatabaseRepository.find({
      order: { no: 'ASC' },
      cache: true,
    });
  }

  public async downloadPokemonImageOfSerebiiNet(pokemonImages: SerebiiNet[] | null): Promise<boolean> {
    if (!pokemonImages) return false;

    const { convertImageToDownload, multiDownloads } = new ImageUtil();
    const imagesToDownload = convertImageToDownload(pokemonImages, 'serebiiNet', true);
    await multiDownloads(imagesToDownload);

    return true;
  }

  public async downloadPokemonIconImageOfSerebiiNet(pokemonImages: SerebiiNet[] | null): Promise<boolean> {
    if (!pokemonImages) return false;

    const { convertImageToDownload, multiDownloads } = new ImageUtil();
    const imagesToDownload = convertImageToDownload(pokemonImages, 'serebiiNet/icon');
    await multiDownloads(imagesToDownload);

    return true;
  }

  public async downloadPokemonImageOfWiki(pokemons: PokemonWiki[] | null): Promise<boolean> {
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
  }

  public async updateImageOfPokemonDatabase(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    const { updatePokemonImages } = new ImageUtil();
    return updatePokemonImages(pokemons);
  }

  public async updateIconImageOfPokemonDatabase(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    const { updatePokemonIconImages } = new ImageUtil();
    return updatePokemonIconImages(pokemons);
  }

  public async updatePokemonName(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertService.convertPokemonName(pokemons);
  }

  public async updatePokemonTypes(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertService.convertPokemonTypes(pokemons);
  }

  public async updatePokemonSpecies(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertService.convertPokemonSpecies(pokemons);
  }

  public async updatePokemonAbilities(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertService.convertPokemonAbilities(pokemons);
  }

  public async updatePokemonEggGroups(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertService.convertPokemonEggGroups(pokemons);
  }

  public async updatePokemonForm(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertService.convertPokemonForm(pokemons);
  }

  public async updatePokemonEvolutionCondition(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertService.convertPokemonEvolutionCondition(pokemons);
  }
}
