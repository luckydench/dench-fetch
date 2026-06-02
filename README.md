[한국어](/readme/README.ko.md)

# Dench

Dench is a lightweight TypeScript HTTP request builder built on top of the native
`fetch` API.

It is designed for small, readable request chains:

```ts
import { dench } from "dench";

type User = {
  id: number;
  name: string;
};

const api = dench("https://api.example.com");

const user = await api
  .get<User>("/users/1")
  .auth("access-token")
  .timeout(3000)
  .toJson();
```

## Purpose

Dench keeps the native `fetch` model while improving the developer experience
of writing HTTP requests with fetch.

The main goals are:

- Create a reusable API client from a base URL.
- Build `GET`, `POST`, `PUT`, and `DELETE` requests with type support, in the
  same spirit as existing fetch DX libraries such as Ky and axios.
- Configure `RequestInit` options and common request patterns such as abort and
  error handling through method chaining, while keeping those settings reusable.
- Keep request execution explicit with terminal methods such as `toJson()` and
  `toResponse()`.
- Reduce common fetch mistakes, such as URL typing mistakes and invalid option
  values.
- Improve DX by minimizing object literals and raw string configuration, using
  types to guide request construction.

## Installation

```bash
npm install dench-fetch
```

(beta version)
```bash
npm install dench-fetch@beta
```

## Basic Usage

### Create a Client

```ts
import { dench } from "dench";

const api = dench("https://api.example.com");
```

### GET

```ts
const posts = await api
  .get<Post[]>("/posts")
  .toJson();
```

### POST JSON

```ts
const created = await api
  .post<Post>("/posts", {
    title: "Hello",
    body: "Dench request",
  })
  .sendJson()
  .toJson();
```

### PUT JSON

```ts
const updated = await api
  .put<Post>("/posts/1", {
    title: "Updated title",
  })
  .sendJson()
  .toJson();
```

### DELETE

```ts
await api
  .delete("/posts/1")
  .toResponse();
```

## Request Options

Dench supports common `fetch` options through builder methods.

```ts
import { HTTPCredentials, HTTPMode } from "dench";

const result = await api
  .get<Result>("/secure")
  .auth("access-token")
  .credentials(HTTPCredentials.INCLUDE)
  .mode(HTTPMode.CORS)
  .timeout(5000)
  .toJson();
```

Available option methods:

- `auth(token)` adds an `Authorization: Bearer ...` header.
- `credentials(value)` sets the fetch credentials policy.
- `abort(controller)` uses an `AbortController` signal.
- `timeout(ms)` aborts the request after the given timeout.
- `cache(value)` sets the fetch cache policy.
- `mode(value)` sets the fetch mode.
- `redirect(value)` sets the fetch redirect policy.
- `referrerPolicy(value)` sets the fetch referrer policy.
- `error(callback)` registers a callback for request errors.

## Body Helpers

`POST` and `PUT` builders support body format helpers.

```ts
await api.post("/json", { name: "dench" }).sendJson().toJson();

const form = new FormData();
form.append("file", file);
await api.post("/upload", form).sendForm().toResponse();

await api.post("/binary", blob).sendBlob().toResponse();
```

Body helper behavior:

- `sendJson()` stringifies the request body and sets
  `Content-Type: application/json`.
- `sendForm()` requires the body to be a `FormData` instance.
- `sendBlob()` sends the body with `Content-Type: application/octet-stream`.

## Response Helpers

Request chains are executed by calling a response helper.

```ts
const response = await api.get("/health").toResponse();
const data = await api.get<Data>("/data").toJson();
const formData = await api.get("/form").toFormData();
```

Available response helpers:

- `toResponse()` returns the native `Response`.
- `toJson<T>()` parses the response body as JSON and returns `T`.
- `toFormData()` parses the response body as `FormData`.

## URL Normalization

Dench normally joins `baseURL` and `api` directly. If the URL may contain
inconsistent slashes, use a normalization helper before executing the request.

```ts
const data = await dench("https://api.example.com/")
  .get<Data>("//users//1")
  .boundaryNormalize()
  .toJson();
```

Normalization helpers:

- `boundaryNormalize()` removes trailing slashes from `baseURL` and ensures the
  API path starts with one slash.
- `hardNormalize()` also collapses duplicated slashes inside the URL parts while
  preserving the protocol separator.

## Types And Enums

Dench exports request builder types and HTTP option enums.

```ts
import {
  dench,
  HTTPCache,
  HTTPCredentials,
  HTTPMode,
  HTTPRedirect,
  HTTPReferrerPolicy,
} from "dench";

import type {
  DenchConfig,
  DenchCreateBuilder,
  DenchGetBuilder,
  DenchInterface,
  DenchRunner,
} from "dench";
```

## Development

```bash
npm run typecheck
npm run build
```

The package is built with `tsup` and outputs both ESM and CommonJS builds in
`dist`.
