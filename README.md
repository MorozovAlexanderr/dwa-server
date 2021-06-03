## Description

Backend part for DWA project using NestJS framework

## Installation 

```bash
# 1. Install the required dependencies
npm install

# 2. Rename the .env.development.example filename to .env.development and set your local variables
mv .env.development.example .env.development

# 3. Rename the ormconfig.example.json filename to ormconfig.json and set your db properties
mv ormconfig.example.json ormconfig.json

# 4. Start the server with the backend application
npm run start
```

## Api documentation

http://localhost:3000/api/

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
