## Description

Backend part for DWA project using NestJS framework

## Installation 

```bash
# 1. Install the required dependencies
npm install

# 2. Rename the .env.development.example filename to .env.development and set your local variables
mv .env.development.example .env.development

# 3. Run app services in Docker
docker-compose up

# 4. Start the server with the backend application
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
