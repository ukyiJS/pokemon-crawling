export interface IDifferentFormImage {
  image: string;
  form: string;
}

export interface IPokemonImage {
  no: string;
  name: string;
  image: string;
  form?: string | null;
  differentForm?: IDifferentFormImage[];
}

export interface ObjectLiteral<T> {
  [key: string]: T;
}
