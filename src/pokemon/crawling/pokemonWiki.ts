import { Logger } from '@nestjs/common';
import { Page } from 'puppeteer';
import { IPokemonWiki } from '../pokemon.interface';

export class PokemonWiki {
  private loopCount: number;

  constructor(loopCount = 893) {
    this.loopCount = loopCount;
  }

  public crawling = async (page: Page): Promise<IPokemonWiki[]> => {
    let currentCount = 0;
    let pokemons: IPokemonWiki[] = [];

    const selector = '.infobox-pokemon';
    const nextClickSelector = 'table.w-100.mb-1 td:nth-child(3) td:nth-child(1) > a';
    const navigationPromise = page.waitForNavigation();

    do {
      await page.waitForSelector(selector);
      const pokemon = await page.evaluate(this.getPokemons);
      const $differentForm = await page.$$eval('#pokemonToggle td', $el => Array.from($el).map($el => $el.textContent));

      for (const [i, form] of $differentForm.entries()) {
        if (!i || !form || /거다이/g.test(form)) continue;

        const differentForm = await page.evaluate(this.getPokemons, i, JSON.stringify(pokemon));
        pokemon.differentForm = [...pokemon.differentForm, differentForm];
      }
      pokemons = [...pokemons, pokemon];

      currentCount = +pokemon.no;
      Logger.warn(currentCount, 'currentCount');

      const percent = `${Math.floor((currentCount / this.loopCount) * 100)}%`;
      Logger.debug(`${JSON.stringify(pokemon)}`, 'Result');
      Logger.verbose(`############################## ${percent} ##############################`, 'Result');

      await page.waitForSelector(nextClickSelector);
      await page.click(nextClickSelector);
      await navigationPromise;
    } while (currentCount < this.loopCount);

    return pokemons;
  };

  private getPokemons = (toggleIndex = 0, pokemonStr?: string): IPokemonWiki => {
    const $element = document.querySelectorAll('.infobox-pokemon')[toggleIndex];
    const pokemon = JSON.parse(pokemonStr ?? '{}') as IPokemonWiki;
    const isDifferentForm = !!toggleIndex;

    const getText = ($el: Element | null): string => $el?.textContent?.trim() ?? '';
    const getTexts = ($el: NodeListOf<Element> | Element[]): string[] =>
      Array.from($el).reduce<string[]>((acc, $el, _, __, text = getText($el)) => (text ? [...acc, text] : acc), []);

    const $no = $element.querySelector('.index');
    const no = getText($no).replace(/\D/g, '');
    const [korName, , engName] = getTexts($element.querySelectorAll(`div[class^='name-']`));
    const form = toggleIndex ? korName : null;
    const image = $element.querySelector<HTMLAnchorElement>('.image a')!.href;

    const $body = Array.from($element.querySelectorAll<Element>('.body > tbody > tr > td:not(.nostyle)'));

    const [
      $types,
      $species,
      $abilities,
      $hiddenAbility,
      ,
      ,
      ,
      $color,
      $friendship,
      $height,
      $weight,
      $captureRate,
      $genderRatio,
    ] = $body;

    const types = getTexts($types.querySelectorAll('a span'));
    const species = getText($species);

    const abilities = getTexts($abilities.querySelectorAll('a span'));
    const hiddenAbility = getText($hiddenAbility) || null;

    if (isDifferentForm && /메가|원시|울트라/g.test(korName)) {
      const [, , , $height, $weight, $megaStone] = $body;
      const form = korName;
      const height = getText($height);
      const weight = getText($weight);
      const megaStone = getText($megaStone) || undefined;

      return { ...pokemon, types, image, species, abilities, hiddenAbility: null, height, weight, form, megaStone };
    }

    const color = {
      name: getText($color),
      code: $color.firstElementChild!.getAttribute('style')!.replace(/background:/, ''),
    };
    const friendship = +getText($friendship) || 0;

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
      image,
      types,
      species,
      abilities,
      hiddenAbility,
      color,
      friendship,
      height,
      weight,
      captureRate,
      genderRatio,
      form,
      differentForm: [],
    };
  };
}
