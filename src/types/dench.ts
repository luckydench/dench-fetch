import type { DenchCreateBuilder, DenchGetBuilder, DenchHeadBuilder } from "./denchBuilder"

/**
 *  HTTP 요청 빌더 인터페이스
 * 
 *  @interface DenchInterface
 *  @function get - GET 요청을 위한 빌더 반환
 *  @function post - POST 요청을 위한 빌더 반환
 *  @function put - PUT 요청을 위한 빌더 반환
 *  @function delete - DELETE 요청을 위한 빌더 반환
 */
export interface DenchInterface{
    baseURL : DenchHTTPURL,
    get : <T>(api?:string) => DenchGetBuilder<T>
    post : <T>(api?: string, data? : unknown) => DenchCreateBuilder<T>
    put : <T>(api?: string, data? : unknown) => DenchCreateBuilder<T>
    patch : <T>(api?: string, data? : unknown) => DenchCreateBuilder<T>
    delete : <T>(api?: string) => DenchGetBuilder<T>,
    head : (api?: string) => DenchHeadBuilder
}


// url 타입을 http:// 또는 https://로 제한하는 게 가능하다.
export type DenchHTTPURL = 
`http://${string}` 
| `https://${string}` 
| `file://${string}` 
| `ftp://${string}` 
| `ws://${string}` 
| `wss://${string}`


export type DenchURLSearchParams = ConstructorParameters<typeof URLSearchParams>[0]