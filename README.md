<a href="http://nestjs.com/" target="_blank"><img src="https://raw.githubusercontent.com/ukyiJS/pokemon-crawling/master/src/assets/img/nest.svg" height="160"/></a>
<a href="https://pptr.dev/" target="_blank"><img src="https://raw.githubusercontent.com/ukyiJS/pokemon-crawling/master/src/assets/img/puppeteer.png" height="160"></a>
<a href="https://typeorm.io/" target="_blank"><img src="https://raw.githubusercontent.com/ukyiJS/pokemon-crawling/master/src/assets/img/typeorm.png" height="160"></a>

## Description

Nestjs crawling

## Require env file

create `.env.dev` `.env.prod`

env value `DATABASE_URL` `PUPPETEER_BROWSER_PATH` `PUPPETEER_PROFILE_PATH`

#### window

`PUPPETEER_BROWSER_PATH=C:/Program Files/Google/Chrome/Application/chrome.exe`

#### wsl

`PUPPETEER_BROWSER_PATH=/mnt/c/Program Files/Google/Chrome/Application/chrome.exe`

#### macos

`PUPPETEER_BROWSER_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run dev

# production mode
$ npm run prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Used Technologies and Libraries

- [NestJS](https://nestjs.com/)
- [Typeorm](https://typeorm.io/)
- [Puppeteer](https://pptr.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
