import type { DenchCreateBuilder, DenchGetBuilder } from "./denchBuilder";


export interface DenchBaseRunner<T>{
    /**
     * fetch 요청을 실행하고 Response 객체를 반환합니다.
     * 
     * @returns Promise<Response>
     */
    toResponse: () => Promise<Response>,
}

/**
 * Dench 요청 실행 인터페이스
 * 
 * @interface DenchRunner
 */
export interface DenchRunner<T> extends DenchBaseRunner<T> {

    /**
     * fetch 요청을 실행하고 응답을 JSON으로 파싱하여 반환합니다.
     * 
     * @returns Promise<T>
     */
    toJson: () => Promise<T>,

    /**
     * fetch 요청을 실행하고 응답을 FormData로 파싱하여 반환합니다.
     * 
     * @returns Promise<FormData>
     */
    toFormData: () => Promise<FormData>
}

/**
 * Head 요청 실행 인터페이스
 * 
 * - head 요청은 body보다 header 정보를 더 중요시 여기므로 toHeadResponse로 헤더 정보를 바로 얻을 수 있습니다.
 * 
 * @interface DenchHeadRunner
 * @extends DenchBaseRunner
 */
export interface DenchHeadRunner extends DenchBaseRunner<never>{

    toHeadResponse : () => Promise<Headers>
    toStatus : () => Promise<number>

}