import { PokemonDatabase } from '@/pokemon/model/pokemonDatabase.entity';
import { IPokemonImage } from '@/pokemon/pokemon.interface';
import { EvolvingToType } from '@/pokemon/types/evolvingTo.type';
import { Logger } from '@nestjs/common';
import axios, { AxiosPromise } from 'axios';
import { createWriteStream, existsSync, mkdirSync, ReadStream } from 'fs';
import { join } from 'path';
import { ProgressBar } from '../progressBar';

export type DataToDownload = {
  no: string;
  url: string;
  fileName: string;
  dirName: string;
};

export class ImageUtil {
  public download = async (url: string, fileName: string, dirName = 'download'): Promise<void> => {
    const downloadDir = join(process.cwd(), 'download');
    if (!existsSync(downloadDir)) {
      mkdirSync(downloadDir);
      Logger.log(downloadDir, 'CreateDirectory');
    }
    const dir = join(process.cwd(), dirName);
    if (!existsSync(dir)) {
      mkdirSync(dir);
      Logger.log(dir, 'CreateDirectory');
    }

    let download = <ReadStream>{};
    try {
      const { data } = await (<AxiosPromise<ReadStream>>axios({ url, responseType: 'stream' }));
      download = data;
    } catch (error) {
      Logger.error(error.message, error.stack, 'Download Error');
      return undefined;
    }

    return new Promise(resolve => {
      download
        .pipe(createWriteStream(`${dir}/${fileName}`))
        .on('finish', resolve)
        .on('error', error => Logger.error(error.message, error.stack, error.name));
    });
  };
  public getGenerationName = (no: number): string => {
    if (no < 152) return 'gen1';
    if (no < 252) return 'gen2';
    if (no < 387) return 'gen3';
    if (no < 494) return 'gen4';
    if (no < 650) return 'gen5';
    if (no < 722) return 'gen6';
    if (no < 810) return 'gen7';
    return 'gen8';
  };
  public convertImageToDownload = (images: IPokemonImage[], dirName?: string, extension = 'png'): DataToDownload[] => {
    return images.reduce<DataToDownload[]>((acc, { no, image, differentForm }) => {
      const fileName = `${no}.${extension}`;
      const _dirName = dirName || this.getGenerationName(+no);
      const downloadData = { no, url: image, fileName, dirName: _dirName };

      if (!differentForm?.length) return [...acc, downloadData];

      const convertedDifferentForm = differentForm.map(({ image, form }) => ({
        no,
        url: image,
        fileName: fileName.replace(/(\d+)(.png)/g, `$1-${form}$2`),
        dirName: _dirName,
      }));
      return [...acc, downloadData, ...convertedDifferentForm];
    }, []);
  };
  public mutilDownloads = async (imagesToDownload: DataToDownload[]): Promise<void> => {
    const { updateProgressBar } = new ProgressBar(imagesToDownload.length);

    for (const [index, { url, fileName, dirName }] of imagesToDownload.entries()) {
      await this.download(url, fileName, dirName);

      const cursor = index + 1;
      Logger.log(`${cursor} : ${fileName}`, 'Download');
      updateProgressBar(cursor);
    }
  };
  private getImageUrl = (name: string): string => {
    return `https://raw.githubusercontent.com/ukyiJS/pokemon-crawling/image/${name}.png`;
  };
  private setImageUrl = (dirName: string, no: string, form?: string): string => {
    const fileName = form ? `${no}-${form}` : no;
    const imageUrl = this.getImageUrl(`${dirName}/${fileName}`);
    return imageUrl;
  };
  private updatePokemonImage = (no: string): string => {
    const dirName = this.getGenerationName(+no);
    const image = this.setImageUrl(dirName, no);
    return image;
  };
  public updatePokemonImages = (pokemons: PokemonDatabase[]): PokemonDatabase[] => {
    const convertEvolvingToImage = (evolvingTo?: EvolvingToType[]): EvolvingToType[] | undefined => {
      if (!evolvingTo) return undefined;

      const result = evolvingTo.map(({ no, evolvingTo, ...pokemon }) => ({
        ...pokemon,
        no,
        image: this.updatePokemonImage(no),
        evolvingTo: convertEvolvingToImage(evolvingTo),
      }));

      return result;
    };

    return pokemons.map(({ no, differentForm, evolvingTo, ...pokemon }) => {
      const image = this.updatePokemonImage(no);
      const differentFormImage = differentForm?.map(({ no, ...pokemon }) => ({
        ...pokemon,
        no,
        image: this.updatePokemonImage(no),
      }));
      const evolvingToImage = convertEvolvingToImage(evolvingTo);

      return { ...pokemon, no, image, evolvingTo: evolvingToImage, differentForm: differentFormImage };
    });
  };
}
