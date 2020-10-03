import { Logger } from '@nestjs/common';
import { Page } from 'puppeteer';
import { IPokemonWiki } from '../pokemon.interface';

export class PokemonWiki {
  private loopCount: number;

  constructor(loopCount = 892) {
    this.loopCount = loopCount;
  }

  public crawling = async (page: Page): Promise<IPokemonWiki[]> => {
    let currentCount = 0;
    let pokemons: IPokemonWiki[] = [];

    const nextClickSelector = 'table.w-100.mb-1 td:nth-child(3) td:nth-child(1) > a';
    const navigationPromise = page.waitForNavigation();

    do {
      const $infobox = await page.waitForSelector('.infobox-pokemon');
      const pokemon = await page.evaluate(this.getPokemons, $infobox);
      pokemons = [...pokemons, pokemon];

      currentCount = +pokemon.no;
      Logger.warn(this.loopCount, 'loopCount');

      const percent = `${Math.floor((currentCount / this.loopCount) * 100)}%`;
      Logger.debug(`${JSON.stringify(pokemon)}`, 'Result');
      Logger.verbose(`############################## ${percent} ##############################`, 'Result');

      await page.waitForSelector(nextClickSelector);
      await page.click(nextClickSelector);
      await navigationPromise;
    } while (currentCount < this.loopCount);

    return pokemons;
  };

  private getPokemons = ($element: Element): IPokemonWiki => {
    const getText = ($element: Element): string => $element.textContent!.trim();
    const getTexts = ($elements: NodeListOf<Element> | Element[]): string[] => Array.from($elements).map(getText);

    const no = getText($element.querySelector('.index')!).replace(/\D/g, '');
    const [korName, , engName] = getTexts($element.querySelectorAll(`div[class^='name-']`));
    const images = Array.from($element.querySelectorAll('.image a')).map($a => ($a as HTMLAnchorElement).href);

    const [
      [$types, $group],
      [$abilities, $hiddenAbility],
      ,
      ,
      ,
      [$color, $friendship],
      [$height, $weight],
      [$captureRate, $genderRatio],
    ] = Array.from($element.querySelectorAll('.body tr:not(:nth-child(7))'))
      .filter((_, i) => i % 2)
      .map($tr => Array.from($tr.children));

    const types = getTexts($types.querySelectorAll('a span'));
    const group = getText($group);

    const abilities = getTexts($abilities.querySelectorAll('a span'));
    const hiddenAbility = getText($hiddenAbility);

    const color = {
      name: getText($color),
      code: $color.firstElementChild!.getAttribute('style')!.replace(/background:/, ''),
    };
    const friendship = +getText($friendship);

    const height = getText($height);
    const weight = getText($weight);

    const captureRate = +getText($captureRate);
    const genderNames = ['수컷', '암컷'];
    const genderText = getText($genderRatio).replace(/[:ㄱ-힣%]/g, '');
    const genderRatio = genderText
      ? genderText.split(' ').map((ratio, i) => ({ name: genderNames[i], ratio: +ratio }))
      : [{ name: '무성', ratio: 100 }];

    return {
      no,
      name: korName,
      engName,
      images,
      types,
      group,
      abilities,
      hiddenAbility,
      color,
      friendship,
      height,
      weight,
      captureRate,
      genderRatio,
    };
  };
}
