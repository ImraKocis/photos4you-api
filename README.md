## Description

Training application made with NestJS, Prisma and PostgresSQL.

## Project includes

- User registration and authentication managed with JWT strategy
  - Email and password
  - Google OAuth
  - Github OAuth
- User profile management
- User roles and permissions
- Subscription management
- Post creation and management

## Installation

Install all dependencies

```bash
yarn install
```

## Environment variables

Create a `.env` file in the root of the project and add the following variables:
 
[Google OAuth](https://console.developers.google.com/)</br>
[GitHub OAuth](https://github.com/settings/developers)

If you want to use the default DB settings, you can use `DATABASE_URL` that is commented out.

```dotenv
DATABASE_URL="postgresql://postgres:{your-db-password}@localhost:{db-port}/{db-name}?schema=public"
#DATABASE_URL="postgresql://postgres:123@localhost:5434/photos4you?schema=public"
JWT_SECRET="your-secret"
REFRESH_JWT_SECRET="your-secret-rt"
GOOGLE_CLIENT_SECRET="chnage-me"
GOOGLE_CLIENT_ID="chnage-me"
GOOGLE_CALLBACK_URL="chnage-me"
GITHUB_CLIENT_ID="chnage-me"
GITHUB_CLIENT_SECRET="chnage-me"
GITHUB_CALLBACK_URL="chnage-me"
```

## Database setup

When setting up the DB for the first time

```bash
prisma migrate dev --name {migration name}
```

## Run Database in docker
Run DB in docker container, if you are running DB with custom credentials, make sure to update the `docker-compose.yml` to math your settings in `.env`.

```bash
# run DB in background
docker compose up -d dev-db

# run DB in terminal
docker compose up dev-db
```
## Running the app

```bash
# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod
```