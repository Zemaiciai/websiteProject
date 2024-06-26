
# Website for videography services

Our project is used for videographers and clients to find each other faster and manage their orders.


# Front-end

We are using Tailwind with very small parts of normal CSS.


# Back-end

We are using Remix (React), Prisma, PostgreSQL.


## How to run our project locally

Install dependencies

```bash
  yarn
```

Then you will need to have "Docker" installed on your pc.

After installing it run the following commands:

```bash
  docker compose up
```

```bash
  yarn migrate
```

Generating a Super Admin, Worker, Client invite codes:

```bash
  yarn setup
```

Starting the project

```bash
  yarn dev
```

## Testing
```bash
  yarn test:unit
```
```bash
  yarn test:unit:coverage
```
```bash
  yarn test:unit:ui
```

## Features

- Messages
- Friend system
- Admin panel
- Groups
- Ads for workers
- Work ordering


## Authors

- [Dominykas Gedvila](https://github.com/gedvilad)
- [Gvidas Štarolis](https://github.com/nobodiis)
- [Faustas Budrius](https://github.com/Makleris73)
- [Gytis Pranauskas](https://github.com/GytisPra)
- [Karolis Jonelis](https://github.com/K4R0L15)


## License

[Mozilla Public License 2.0](https://choosealicense.com/licenses/mpl-2.0/)
