import type { DenchRunner } from "./denchRunner";
import type { DenchBaseConfig } from "./denchConfig";
import type { HTTPCache, HTTPCredentials, HTTPMode, HTTPRedirect, HTTPReferrerPolicy } from "./denchHTTPEnum";
import type { DenchAuthType, DenchURLNormalizeMode } from "./denchEnum";
import type { DenchURLSearchParams } from "./dench";

export interface DenchBuildUtils<T, R extends DenchBuilder<T, R>>{
    /**
     * 빌더를 복사합니다.
     * 
     * @example 다음과 같이 재활용 하는 용도로 사용할 수 있습니다.
     * ```ts
     * const common_builder = dench("http://example.com").get().auth("mytoken").timeout(5000);
     * 
     * const builder1 = common_builder.copy().api("/api/endpoint1");
     * const builder2 = common_builder.copy().api("/api/endpoint2");
     * const builder3 = common_builder.copy().api("/api/endpoint3");
     * 
     * const res1 = await builder1.toJson();
     * await builder2.toJson();
     * await builder3.toJson();
     * ```
     * 
     * @returns 복사된 빌더 인스턴스
     */
    copy : () => R
}


export interface DenchBuilder<T, R extends DenchBuilder<T, R>> extends DenchBuildUtils<T, R> {
    config : DenchBaseConfig,
    /**
     * 인증 토큰 설정을 추가합니다.
     * @config { Authorization : `Bearer ${token}`}
     */
    auth: (token: string, type? : DenchAuthType) => R,


    /**
     * credentials 설정을 추가합니다.
     * @config { credentials : credentials }
     */
    credentials: (credentials: HTTPCredentials) => R,

    /**
     * mode 설정을 추가합니다.
     * @config { mode : mode }
     */
    mode: (mode: HTTPMode) => R,

    /**
     * fetch의 cache 설정을 추가합니다.
     * @config { cache : cache }
     */
    cache: (cache: HTTPCache) => R,

    /**
     * fetch의 redirect 설정을 추가합니다.
     * @config { redirect : redirect }
     */
    redirect: (redirect: HTTPRedirect) => R,

    /**
     * referrerPolicy 설정을 추가합니다.
     * @config { referrerPolicy : policy }
     */
    referrerPolicy: (policy: HTTPReferrerPolicy) => R,
    

    /**
     * 요청을 중단할 수 있는 AbortController를 설정합니다.
     * @param controller AbortController 인스턴스
     * @returns DenchGetBuilder<T>
     */
    abort: (controller: AbortController) => R,

    /**
     * 요청 timeout 설정을 추가합니다.
     * @param ms ms 단위 timeout 시간
     */
    timeout: (ms: number) => R,


    /**
     * 에러 콜백을 설정합니다. 
     * fetch 과정에서 에러가 발생 시 해당 콜백이 호출됩니다.
     */
    error: (callback: (error: unknown) => void) => R,


    params : (params : DenchURLSearchParams) => R,

    /**
     * URL의 슬래쉬 경계 부분을 정규화 합니다.
     * 
     * 1.  baseURL 끝의 슬래쉬를 제거하고 apiURL의 시작엔 최소 한개의 슬래쉬를 생성한다.
     * 2.  baseURL과 apiURL에 슬래쉬가 중복 발생하는 모든 경우에 하나로 바꾼다.
     * 
     * @example1 http://example.com/ -> http://example.com
     * @example2 http://example.com + //api// -> http://example.com + /api
     * @example3 https:////example.com + //api/aa -> https://example.com + /api/aa
     * 
     * 만약 슬래시를 두 개 이상 사용하는 것이 의도라면 해당 함수를 사용하지 마세요
     * 
     * @returns 
     */
    boundaryNormalize: () => R,


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
    * tip : 만약 슬래시를 두 개 이상 사용하는 것이 의도라면 해당 함수를 사용하지 마세요
    * 또한 성능적인 소모가 존재하니 예측 불가능한 URL이 들어오는 경우에 사용하고, 
    * URL을 직접 눈으로 확인해서 관리하는 것을 권장합니다.
    * 
    * @returns 
    */
    hardNormalize: () => R


    /**
     * URL 정규화 모드를 설정합니다.
     * 
     * - NONE : URL 정규화를 하지 않습니다.
     * - BOUNDARY : 슬래쉬 경계 부분만 정규화 합니다. (기본값)
     * - HARD : 슬래쉬 경계 부분과 apiURL 끝의 슬래쉬를 제거하는 등 더 엄격하게 정규화 합니다.
     * 
     * @param normalizeMode 
     * @returns 
     */

    URLNormalize : (normalizeMode : DenchURLNormalizeMode)=> R

}





/**
 * Dench post, put 타입 요청의 빌더 인터페이스
 * 
 * @interface DenchCreateBuilder
 */
export interface DenchCreateBuilder<T> extends DenchBuilder<T, DenchCreateBuilder<T>>, DenchRunner<T>{
    /**
     * 요청 데이터를 JSON 형식으로 전송합니다.
     * 
     * data를 생략할 경우 dench.post 또는 dench.put 메서드에 전달된 data가 사용됩니다.
     * 이미 설정한 경우 덮어쓰기가 되니 주의하세요.
     * @header { "Content-Type" : "application/json" }
     */
    sendJson : (data? : unknown) => DenchCreateBuilder<T>,
    /**
     * 요청 데이터를 FormData 형식으로 전송합니다.
     * 
     * data를 생략할 경우 dench.post 또는 dench.put 메서드에 전달된 data가 사용됩니다.
     * 이미 설정한 경우 덮어쓰기가 되니 주의하세요.
     * @header { "Content-Type" : "multipart/form-data" }
     */
    sendForm : (data? : FormData) => DenchCreateBuilder<T>,
    /**
     * 요청 데이터를 Blob 형식으로 전송합니다.
     * 
     * data를 생략할 경우 dench.post 또는 dench.put 메서드에 전달된 data가 사용됩니다.
     * 이미 설정한 경우 덮어쓰기가 되니 주의하세요.
     * @header { "Content-Type" : "application/octet-stream" }
     */
    sendBlob : (data? : Blob) => DenchCreateBuilder<T>,

    /**
     * 요청 데이터를 URLSearchParams 형식으로 전송합니다.
     * 
     * data를 생략할 경우 dench.post 또는 dench.put 메서드에 전달된 data가 사용됩니다.
     * 이미 설정한 경우 덮어쓰기가 되니 주의하세요.
     * @header { "Content-Type" : "application/x-www-form-urlencoded" }
     */
    sendUrlEncoded : (data?  : DenchURLSearchParams) => DenchCreateBuilder<T>

    /**
     * 요청 데이터를 원시 BodyInit 형식으로 전송합니다.
     * 어떠한 변환 없이 data를 그대로 body에 넣습니다.
     * 
     * data를 생략할 경우 dench.post 또는 dench.put 메서드에 전달된 data가 사용됩니다.
     * 이미 설정한 경우 덮어쓰기가 되니 주의하세요.
     * @header { "Content-Type" : "application/octet-stream" }
     */
    sendRaw : (data? : BodyInit) => DenchCreateBuilder<T>


    /**
     * api URL을 설정합니다.
     */
    api: <P = T>(api: string) => DenchCreateBuilder<P>,


}


/**
 * GET 요청 빌더 인터페이스
 * 
 * @interface DenchGetBuilder
 */
export interface DenchGetBuilder<T> extends DenchBuilder<T, DenchGetBuilder<T>>, DenchRunner<T>{


    /**
     * api URL을 설정합니다.
     */
    api: <P = T>(api: string) => DenchGetBuilder<P>,

}
