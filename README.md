## Description

Backend part for DWA project using NestJS framework

## Installation 

```bash
# 1. Install the required dependencies
npm install

# 2. Rename the .env.example filename to .env and set your local variables
mv .env.example .env
```

## Run
### With Docker
```
docker-compose up
```

### Locally
```
npm run start
```

## Api documentation

http://localhost:3000/swagger/

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
