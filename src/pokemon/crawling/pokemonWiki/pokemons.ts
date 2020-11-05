import { IPokemonsOfWiki } from '@/pokemon/pokemon.interface';
import { CrawlingUtil, ProgressBar } from '@/utils';

export class PokemonsOfWiki extends CrawlingUtil {
  protected promiseLocalStorage: Promise<void>;

  public crawling = async (): Promise<IPokemonsOfWiki[]> => {
    let curser = 0;
    let pokemons: IPokemonsOfWiki[] = [];
    const progressBar = new ProgressBar();
    const numberOfLoop = 893;

    const isLoop = curser < numberOfLoop;
    const selector = '.infobox-pokemon';
    const nextClickSelector = 'table.w-100.mb-1 td:nth-child(3) td:nth-child(1) > a';
    const navigationPromise = this.page.waitForNavigation();

    do {
      await this.page.waitForSelector(selector);

      const pokemon = await this.page.evaluate(this.getPokemons);

      const isToggleTable = await this.page.$('#pokemonToggle table');
      const toggleSelector = isToggleTable ? '#pokemonToggle table td' : '#pokemonToggle td';
      const forms = await this.page.$$eval(toggleSelector, (_, $el = Array.from(_)) =>
        $el.map($el => $el.textContent).filter((f, i) => i && f && !/거다이/g.test(f)),
      );
      if (forms.length) {
        pokemon.differentForm = (
          await Promise.all(forms.map((_, i) => this.page.evaluate(this.getPokemons, i + 1, JSON.stringify(pokemon))))
        ).map((differentForm, i) => ({ ...differentForm, form: forms[i] }));
      }

      pokemons = [...pokemons, pokemon];

      curser = +pokemon.no;
      progressBar.update((curser / numberOfLoop) * 100, `${pokemon.no} : ${pokemon.name}`);

      if (!isLoop) break;

      await this.page.waitForSelector(nextClickSelector);
      await this.page.click(nextClickSelector);
      await navigationPromise;
    } while (isLoop);

    return pokemons;
  };

  private getPokemons = (toggleIndex = 0, pokemonStr?: string): IPokemonsOfWiki => {
    const $element = document.querySelectorAll('.infobox-pokemon')[toggleIndex];
    const pokemon = JSON.parse(pokemonStr ?? '{}') as IPokemonsOfWiki;
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
      $gender,
    ] = $body;

    const types = getTexts($types.querySelectorAll('a span'));
    const species = getText($species);

    const abilities = getTexts($abilities.querySelectorAll('a span'));
    let hiddenAbility = getText($hiddenAbility) || null;
    if (hiddenAbility && /없음/g.test(hiddenAbility)) hiddenAbility = null;

    if (isDifferentForm && /메가|원시|울트라/g.test(korName)) {
      const [, , , $height, $weight, $megaStone] = $body;
      return {
        ...pokemon,
        types,
        image,
        species,
        abilities,
        hiddenAbility: null,
        height: getText($height),
        weight: getText($weight),
        differentForm: [],
        megaStone: getText($megaStone) || undefined,
      };
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
    const genderText = getText($gender).replace(/[:ㄱ-힣%]/g, '');
    const gender = genderText
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
      gender,
      form: null,
      differentForm: [],
    };
  };
}
