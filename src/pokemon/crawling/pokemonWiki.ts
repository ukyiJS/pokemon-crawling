import { LoadingBar } from '@/utils/loadingBar';
import { Logger } from '@nestjs/common';
import { blueBright, whiteBright, yellowBright } from 'chalk';
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

    const loadingBar = new LoadingBar('log');

    do {
      await page.waitForSelector(selector);
      const pokemon = await page.evaluate(this.getPokemons);
      const isToggleTable = await page.$('#pokemonToggle table');
      const toggleSelector = isToggleTable ? '#pokemonToggle table td' : '#pokemonToggle td';
      const $differentForm = await page.$$eval(toggleSelector, $el => Array.from($el).map($el => $el.textContent));

      for (const [i, form] of $differentForm.entries()) {
        if (!i || !form || /거다이/g.test(form)) continue;

        const differentForm = await page.evaluate(this.getPokemons, i, JSON.stringify(pokemon));
        pokemon.form = form;
        pokemon.differentForm = [...pokemon.differentForm, differentForm];
      }
      pokemons = [...pokemons, pokemon];

      currentCount = +pokemon.no;

      const percent = (currentCount / this.loopCount) * 100;
      const json = `${JSON.stringify(pokemon)}`
        .replace(/("(?=n|e|i|t|s|c|a|h|f|w|g|r|d)(\w)+")/g, (_, m1) => m1.replace(/"/g, ''))
        .replace(/(:|,|{)+(?!\/)/g, '$1 ')
        .replace(/(})/g, ' $1')
        .replace(/([[\]{}])/g, blueBright('$1'))
        .replace(/(\w+:(?!\/))/g, yellowBright('$1'));
      loadingBar.update(percent);
      Logger.log(whiteBright(json), 'Result');

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
    let hiddenAbility = getText($hiddenAbility) || null;
    if (hiddenAbility && /없음/g.test(hiddenAbility)) hiddenAbility = null;

    if (isDifferentForm && /메가|원시|울트라/g.test(korName)) {
      const [, , , $height, $weight, $megaStone] = $body;
      const height = getText($height);
      const weight = getText($weight);
      const megaStone = getText($megaStone) || undefined;

      return { ...pokemon, types, image, species, abilities, hiddenAbility: null, height, weight, megaStone };
    }

    const color = {
      name: getText($color),
      code: $color
        .querySelector('span')!
        .getAttribute('style')!
        .replace(/background:/, ''),
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
      form: null,
      differentForm: [],
    };
  };
}
