<div align="center">
  <img src="./readme/img/Dench.png" alt="Dench logo" width="260" />

  <h1>Dench</h1>

  <p>
    A lightweight, type-safe HTTP request builder built on the native Fetch API.
  </p>

  <p>
    <a href="https://denchdocs.vercel.app/docs/intro"><strong>Documentation</strong></a>
    ·
    <a href="https://www.npmjs.com/package/dench-fetch">npm</a>
    ·
    <a href="./readme/README.ko.md">한국어</a>
    ·
    <a href="./readme/update">Update Notes</a>
    .
    <a href="./readme/architecture/dench-fetch-architecture.md">Architecture</a>
  </p>

  <p>
    <a href="https://www.npmjs.com/package/dench-fetch">
      <img src="https://img.shields.io/npm/v/dench-fetch?label=npm" alt="npm version" />
    </a>
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Fetch_API-Native-2E7D32" alt="Fetch API" />
    <img src="https://img.shields.io/badge/tsup-8.5-F7DF1E" alt="tsup" />
    <img src="https://img.shields.io/badge/Vitest-4.1-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
  </p>
</div>

## What Is Dench?

Dench is a TypeScript HTTP client library that wraps the native `fetch` API in a
small, chainable request builder.

It keeps the behavior and flexibility of `fetch` while providing a more
structured way to configure requests, reuse common settings, and receive typed
responses.

```ts
const user = await dench("https://api.example.com")
  .get<User>("/users/1")
  .auth("access-token")
  .timeout(3000)
  .toJson();
```

## Purpose

Dench was created to improve the developer experience of writing HTTP requests
with `fetch`.

- Reduce repetitive `RequestInit` objects and raw string configuration.
- Guide request construction with TypeScript types.
- Minimize common mistakes involving URLs and option values.
- Configure common patterns such as authentication, timeout, abort, and error
  handling through method chaining.
- Reuse API clients and request builder settings without hiding the underlying
  Fetch API behavior.

## Installation

Install the latest stable version:

```bash
npm install dench-fetch
```

Install the latest beta version:

```bash
npm install dench-fetch@beta
```

## Basic Usage

Create a reusable client from a base URL:

```ts
import { dench } from "dench-fetch";

const api = dench("https://api.example.com");
```

Send a typed GET request:

```ts
type User = {
  id: number;
  name: string;
};

const user = await api
  .get<User>("/users/1")
  .toJson();
```

Send JSON data with a POST request:

```ts
type Post = {
  id: number;
  title: string;
};

const created = await api
  .post<Post>("/posts")
  .sendJson({
    title: "Hello, Dench",
  })
  .toJson();
```

Add common request options through method chaining:

```ts
const result = await api
  .get<Result>("/secure")
  .auth("access-token")
  .timeout(5000)
  .toJson();
```

For complete API usage, available methods, and advanced examples, see the
[Dench documentation](https://denchdocs.vercel.app/docs/intro).
