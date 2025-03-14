# ms2d-photomaton-server

## Requirements

- `bun` must be installed (bun.sh)
- `GMAIL_USERNAME` env variable with a valid gmail address
- `GMAIL_PASSWORD` env variable with app password of gmail account - https://myaccount.google.com/apppasswords
- `PICTURES_PATH` env variable with the path to where the pictures are saved by the front-end application

## Installation

To install dependencies:

```bash
bun install
```

To run tests :
```bash
bun test --timeout=10
```

*WARNING : Tests will send actual emails (hence the need for a longer timeout delay)*

## Running

To start project :

```bash
bun run index.ts
```

## Use

Send a `POST` request to `http://localhost:3000/send-picture` with a body like :
````json
{
  "pictures": "001",
  "emails": "axool37130@gmail.com"
}
````

`pictures` and `emails` can also be arrays.

This project was created using `bun init` in bun v1.2.5. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
