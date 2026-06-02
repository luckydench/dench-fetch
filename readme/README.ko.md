# Dench

Dench는 네이티브 `fetch` API를 기반으로 만든 가벼운 TypeScript HTTP 요청 빌더입니다.

반복되는 요청 설정을 짧고 읽기 쉬운 체이닝 코드로 작성할 수 있게 해줍니다.

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

## 목적

Dench는 `fetch`의 기본 모델은 유지하면서, 기존의 http request fetch 사용에 대한 DX 개선을 목표로 합니다.

주요 목적은 다음과 같습니다.

- base URL을 기준으로 재사용 가능한 API 클라이언트를 생성합니다.
- Ky, axios등 기존의 fetch DX 개선 라이브러리가 그러했듯 `GET`, `POST`, `PUT`, `DELETE` 요청을 타입 지원과 함께 작성합니다.
- fetch 의 RequestInit이나 자주 보게 되는 패턴(abort, error등)을 메서드 체이닝으로 설정할 수 있으며, 이 설정 또한 재사용이 가능하게 관리합니다.
- `toJson()`, `toResponse()` 같은 실행 메서드로 요청 시점을 명확하게 만듭니다.
- url 타이핑 실수, 속성 값 타이핑 실수 등 종종 발생하는 fetch 작성 실수를 최소화 시킵니다.
- 객체 작성 문법과 문자열 작성을 최소화 시키고 타입으로 규제하여 DX를 개선하고 작성 실수를 최소화 시킵니다.


그리고 추후 "재사용 가능성"을 염두해 둔 preset 기능을 업데이트 할 계획입니다. 기대해주세요!

## 설치

```bash
npm install dench-fetch
```

(베타 버전)
```bash
npm install dench-fetch@beta
```

## 기본 사용법

### 클라이언트 생성

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

## 요청 옵션

Dench는 자주 사용하는 `fetch` 옵션을 빌더 메서드로 제공합니다.

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

사용 가능한 옵션 메서드는 다음과 같습니다.

- `auth(token)`은 `Authorization: Bearer ...` 헤더를 추가합니다.
- `credentials(value)`는 fetch credentials 정책을 설정합니다.
- `abort(controller)`는 `AbortController`의 signal을 사용합니다.
- `timeout(ms)`는 지정한 시간이 지나면 요청을 중단합니다.
- `cache(value)`는 fetch cache 정책을 설정합니다.
- `mode(value)`는 fetch mode를 설정합니다.
- `redirect(value)`는 fetch redirect 정책을 설정합니다.
- `referrerPolicy(value)`는 fetch referrer policy를 설정합니다.
- `error(callback)`은 요청 에러 발생 시 호출할 콜백을 등록합니다.

## Body Helper

`POST`와 `PUT` 빌더는 요청 body 형식을 지정하는 helper를 제공합니다.

```ts
await api.post("/json", { name: "dench" }).sendJson().toJson();

const form = new FormData();
form.append("file", file);
await api.post("/upload", form).sendForm().toResponse();

await api.post("/binary", blob).sendBlob().toResponse();
```

각 helper의 동작은 다음과 같습니다.

- `sendJson()`은 요청 body를 JSON 문자열로 변환하고 `Content-Type: application/json`을 설정합니다.
- `sendForm()`은 body가 `FormData` 인스턴스일 때 사용합니다.
- `sendBlob()`은 `Content-Type: application/octet-stream`으로 body를 전송합니다.

## 응답 Helper

요청 체인은 응답 helper를 호출할 때 실행됩니다.

```ts
const response = await api.get("/health").toResponse();
const data = await api.get<Data>("/data").toJson();
const formData = await api.get("/form").toFormData();
```

사용 가능한 응답 helper는 다음과 같습니다.

- `toResponse()`는 네이티브 `Response`를 반환합니다.
- `toJson<T>()`는 응답 body를 JSON으로 파싱하고 `T` 타입으로 반환합니다.
- `toFormData()`는 응답 body를 `FormData`로 파싱합니다.

## URL 정규화

Dench는 기본적으로 `baseURL`과 `api`를 그대로 이어 붙입니다. URL의 슬래시가 일정하지 않을 수 있다면 요청 실행 전에 정규화 helper를 사용할 수 있습니다.

```ts
const data = await dench("https://api.example.com/")
  .get<Data>("//users//1")
  .boundaryNormalize()
  .toJson();
```

정규화 helper는 다음과 같습니다.

- `boundaryNormalize()`는 `baseURL` 끝의 슬래시를 제거하고 API path가 하나의 슬래시로 시작하도록 만듭니다.
- `hardNormalize()`는 프로토콜 구분자(`https://`)를 보존하면서 URL 내부의 중복 슬래시도 정리합니다.

## 타입과 Enum

Dench는 요청 빌더 타입과 HTTP 옵션 enum을 내보냅니다.

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

## 개발

```bash
npm run typecheck
npm run build
```

이 패키지는 `tsup`으로 빌드되며, `dist` 폴더에 ESM과 CommonJS 결과물을 생성합니다.
