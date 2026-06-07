import type { DenchURLSearchParams } from "../types/dench"
import type { DenchConfig } from "../types/denchConfig"
import { DenchAuthType } from "../types/denchEnum"
import type { HTTPCache, HTTPCredentials, HTTPMode, HTTPRedirect, HTTPReferrerPolicy } from "../types/denchHTTPEnum"

/**
 * timeout 설정 
 * 
 * @param config 
 * @param ms 
 * @returns 
 */
export function timeoutConfig(config : DenchConfig, ms : number) : DenchConfig {
    return {
        ...config,
        timeout : ms
    }
}

/**
 * AbortController를 통한 abort signal 설정
 * 
 * 만약 해당 DechConfig 객체를 풀에 넣어 재 사용할 계획이라면 
 * 해당 함수를 통해 다시 abort controller를 설정할 것을 권장합니다.
 * 
 * @param config 
 * @param controller 
 * @returns 
 */
export function abortConfig(config : DenchConfig, controller : AbortController) : DenchConfig {
    return {
        ...config,
        abortController: controller,
        options : {
            ...config.options,
            signal : controller.signal
        }
    }
}


/**
 * 
 * 인증 토큰을 Authorization 헤더에 설정하는 함수
 * 
 * @param config 
 * @param token 
 * @param type 토큰 타입 (예: Bearer, Basic 등). 기본값은 Bearer입니다.
 * @returns 
 */
export function authConfig(config: DenchConfig, token: string, type?: DenchAuthType): DenchConfig {
    if(!type){
        type = DenchAuthType.BEARER;
    }

    let authHeaderValue : string = `${type} ${token}`;

    if(type == DenchAuthType.ETC){
        authHeaderValue = token;
    }

    const header = {
        ...config.options.headers,
        'Authorization': `${authHeaderValue}`
    }

    return {
        ...config,
        options: {
            ...config.options,
            headers: header
        }
    }
}

/**
 * 쿠키 기반 인증을 위한 credentials 설정 함수
 * 
 * @param config 
 * @param credentials 
 * @returns 
 */
export function credentialsConfig(config: DenchConfig, credentials: HTTPCredentials): DenchConfig {
    
    return {
        ...config,
        options : {
            ...config.options,
            headers : {
                ...config.options.headers
            },
            credentials : credentials
        }
    }
}


export function sendJsonConfig(config : DenchConfig, data?: any) :DenchConfig{

    if(data !== undefined){
        config.options.body = data;
    }

    return{
        ...config,
        options : {
            ...config.options,
            headers :{
                ...config.options.headers,
                'Content-Type' : 'application/json'
             },
             body : JSON.stringify(config.options.body)
            }
        }
}

export function sendFormConfig(config : DenchConfig, data?: any) : DenchConfig {

    if(data !== undefined){
        config.options.body = data;
    }

    if(!(config.options.body instanceof FormData)){
        throw new Error("Body must be an instance of FormData when using sendForm");
    }

    return {
        ...config,
        options : {
            ...config.options,
            headers : {
                ...config.options.headers,
            },
            body : config.options.body
        }
    }
}


export function sendBlobConfig(config : DenchConfig, data?: any) : DenchConfig {
    if(data !== undefined){
        config.options.body = data;
    }

    return{
        ...config,
        options : {
            ...config.options,
            headers : {
                ...config.options.headers,
                'Content-Type' : 'application/octet-stream'
             },
            body : config.options.body
        }
    }
}

export function sendUrlEncodedConfig(config : DenchConfig, data?: DenchURLSearchParams) : DenchConfig {

    if(data !== undefined){
        const body = new URLSearchParams(data);
        config.options.body = body;
    }

    return {
        ...config,
        options : {
            ...config.options,
            headers : {
                ...config.options.headers,
                'Content-Type' : 'application/x-www-form-urlencoded'
                },
            body : config.options.body
        }
    }

}

export function sendRawConfig(config : DenchConfig, data?: any) : DenchConfig {

    if(data !== undefined){
        config.options.body = data;
    }
    
    return {
        ...config,
        options : {
            ...config.options,
            headers : {
                ...config.options.headers,
                'Content-Type' : 'application/octet-stream'
                },
            body : config.options.body
        }
    }

}




export function modeConfig(config : DenchConfig, mode : HTTPMode) : DenchConfig {
    return {
        ...config,
        options : {
            ...config.options,
            mode : mode
        }
    }
}

export const cacheConfig = (config : DenchConfig, cache : HTTPCache) : DenchConfig => {
    return {
        ...config,
        options : {
            ...config.options,
            cache : cache
        }
    }
}

export const referrerPolicyConfig = (config : DenchConfig, policy : HTTPReferrerPolicy) : DenchConfig => {
    return {
        ...config,
        options : {
            ...config.options,
            referrerPolicy : policy
        }
    }
}


export const redirectConfig = (config : DenchConfig, redirect : HTTPRedirect) : DenchConfig => {
    return {
        ...config,
        options : {
            ...config.options,
            redirect : redirect
        }
    }
}


export const errorConfig = (config: DenchConfig, callback : (error : unknown) => void) => {
    config.errorcallback = callback;
}


