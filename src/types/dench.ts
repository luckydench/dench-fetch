import type { HTTPCache, HTTPCredentials, HTTPMode, HTTPRedirect, HTTPReferrerPolicy } from "./denchEnum";


export interface DenchBaseConfig{
    baseURL : string,
    api : string,
    errorcallback? : (error : unknown) => void,
    options : {
        method : string,
        credentials? : HTTPCredentials,
        signal? : AbortSignal,
        headers? : Record<string, string>,
        body?: BodyInit,
        cache? : HTTPCache
        mode? : HTTPMode
        redirect? : HTTPRedirect
        referrerPolicy? : HTTPReferrerPolicy
    } ,
}

export interface DenchConfig extends DenchBaseConfig{
    abortController?: AbortController,   
    timeout? : number;
}

export interface DenchBuilder<T>{
    config : DenchBaseConfig,
}

export interface DenchCreateBuilder<T> extends DenchBuilder<T>, DenchRunner<T>{
    abort: (controller: AbortController) => DenchCreateBuilder<T>,
    auth: (token:string) => DenchCreateBuilder<T>,
    credentials: (credentials: HTTPCredentials) => DenchCreateBuilder<T>,
    timeout: (ms : number) => DenchCreateBuilder<T>,
    mode : (mode : HTTPMode) => DenchCreateBuilder<T>,
    cache : (cache : HTTPCache) => DenchCreateBuilder<T>,
    redirect : (redirect : HTTPRedirect) => DenchCreateBuilder<T>,
    referrerPolicy : (policy : HTTPReferrerPolicy) => DenchCreateBuilder<T>,
    error: (callback: (error: unknown) => void) => DenchCreateBuilder<T>,
    sendJson : () => DenchCreateBuilder<T>,
    sendForm : () => DenchCreateBuilder<T>,
    sendBlob : () => DenchCreateBuilder<T>,
    boundaryNormalize : () => DenchCreateBuilder<T>,
    hardNormalize : () => DenchCreateBuilder<T>
}


/**
 * GET 요청 빌더 인터페이스
 * 
 * @interface DenchGetBuilder
 */
export interface DenchGetBuilder<T> extends DenchBuilder<T>, DenchRunner<T>{
    abort: (controller : AbortController) => DenchGetBuilder<T>,
    auth: (token:string) => DenchGetBuilder<T>,
    timeout : (ms : number) => DenchGetBuilder<T>,
    credentials: (credentials : HTTPCredentials) => DenchGetBuilder<T>,
    cache : (cache : HTTPCache) => DenchGetBuilder<T>,
    mode : (mode : HTTPMode) => DenchGetBuilder<T>,
    redirect : (redirect : HTTPRedirect) => DenchGetBuilder<T>,
    error: (callback: (error: unknown) => void) => DenchGetBuilder<T>,
    boundaryNormalize: () => DenchGetBuilder<T>,
    referrerPolicy: (policy : HTTPReferrerPolicy) => DenchGetBuilder<T>,
    /**
     * URL을 더 엄격하게 정규화 합니다.
     * 
     * 1.  baseURL 끝의 슬래쉬를 제거하고 apiURL의 시작엔 최소 한개의 슬래쉬를 생성한다.
     * 2.  baseURL과 apiURL에 슬래쉬가 중복 발생하는 모든 경우에 하나로 바꾼다.
     * 3.  apiURL의 끝 부분 슬래쉬를 제거한다.
     * 4.  http: 또는 https: 에는 슬래쉬가 정확히 두 개 오게 한다. 
     * 
     * @example1 http://example.com/ -> http://example.com
     * @example2 http://example.com + //api// -> http://example.com + /api
     * @example3 https:////example.com + //api/aa -> https://example.com + /api/aa
     * 
     * 만약 슬래시를 두 개 이상 사용하는 것이 의도라면 해당 함수를 사용하지 마세요
     * 또한 성능적인 소모가 존재하니 예측 불가능한 URL이 들어오는 경우에만 사용하세요
     * 
     * @returns 
     */
    hardNormalize: () => DenchGetBuilder<T>
}


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
    baseURL : string,
    get : <T>(api:string) => DenchGetBuilder<T>
    post : <T>(api: string, data : any) => DenchCreateBuilder<T>
    put : <T>(api: string, data : any) => DenchCreateBuilder<T>
    delete : <T>(api: string) => DenchGetBuilder<T>
}


export interface DenchRunner<T> {
    toResponse: () => Promise<Response>,
    toJson: () => Promise<T>,
    toObject: () => Promise<T>,
    toFormData: () => Promise<FormData>
}