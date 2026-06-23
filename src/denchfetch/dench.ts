import { 
    credentialsConfig, abortConfig, authConfig, 
    timeoutConfig, sendJsonConfig, 
    sendFormConfig, sendBlobConfig, 
    modeConfig, 
    cacheConfig,
    referrerPolicyConfig,
    redirectConfig,
    errorConfig,
    sendUrlEncodedConfig,
    sendRawConfig,
    paramsConfig, } from "./denchConfigModule"
import { runfetch, toFormData, toHeadResponse, toJson, toStatus } from "./denchRunner";
import type { HTTPCache, HTTPCredentials, HTTPMode, HTTPRedirect, HTTPReferrerPolicy } from "../types/denchHTTPEnum";
import type {  DenchCreateBuilder, DenchGetBuilder, DenchHeadBuilder } from "../types/denchBuilder";
import { type DenchConfig } from "../types/denchConfig";
import { DenchURLNormalizeMode, type DenchAuthType } from "../types/denchEnum";
import type { DenchInterface, DenchHTTPURL, DenchURLSearchParams } from "../types/dench";
import type { DenchBaseRunner, DenchHeadRunner, DenchRunner } from "../types/denchRunner";

const createBaseRunner = <T>(config: DenchConfig): DenchBaseRunner<T> => {
    return {
        toResponse: () => runfetch<T>(config)
    }
}   

const createRunner = <T>(config: DenchConfig): DenchRunner<T> => {
    return {
        toResponse: () => runfetch<T>(config),
        toJson: () => toJson<T>(config),
        toFormData: () => toFormData<T>(config)
    }
}

const createHeadRunner = (config : DenchConfig) : DenchHeadRunner => {
    return{
        toResponse: () => runfetch(config),
        toHeadResponse: () => toHeadResponse(config),
        toStatus: () => toStatus(config)
    }
}


const createBuilder = <T>(config  : DenchConfig, label? : string) : DenchCreateBuilder<T> | DenchGetBuilder<T> => (
    {
        config: config,
        ...createRunner<T>(config),
        error: (callback: (error: unknown) => void) => {
            errorConfig(config, callback);
            return createBuilder<T>(config);
        },
        credentials: (credentials: HTTPCredentials) => createBuilder<T>(credentialsConfig(config, credentials)),
        abort: (controller: AbortController) => createBuilder<T>(abortConfig(config, controller)),
        auth: (token: string, type?: DenchAuthType) => createBuilder<T>(authConfig(config, token, type)),
        timeout: (ms: number) => createBuilder<T>(timeoutConfig(config, ms)),
        cache: (cache: HTTPCache) => createBuilder<T>(cacheConfig(config, cache)),
        referrerPolicy: (policy: HTTPReferrerPolicy) => createBuilder<T>(referrerPolicyConfig(config, policy)),
        mode: (mode: HTTPMode) => createBuilder<T>(modeConfig(config, mode)),
        redirect: (redirect: HTTPRedirect) => createBuilder<T>(redirectConfig(config, redirect)),
        api: <P = T>(api: string) => createBuilder<P>({ ...config, api }),
        params: (params: DenchURLSearchParams) => createBuilder<T>(paramsConfig(config, params)),
        boundaryNormalize: () => {
            const newConfig = {
                ...config,
                URLNormalize: DenchURLNormalizeMode.BOUNDARY,
            }
            return createBuilder<T>(newConfig);
        },
        hardNormalize: () => {
            const newConfig = {
                ...config,
                URLNormalize: DenchURLNormalizeMode.HARD,
            }
            return createBuilder<T>(newConfig);
        },
        URLNormalize: (normalizeMode: DenchURLNormalizeMode = DenchURLNormalizeMode.BOUNDARY) => {
            const newConfig = {
                ...config,
                URLNormalize: normalizeMode
            }
            return createBuilder<T  >(newConfig);
        },
        copy: () => {
            const copiedConfig: DenchConfig = {
                ...config,
                options: {
                    ...config.options,
                    headers: config.options.headers ? { ...config.options.headers } : undefined,
                    body: config.options.body
                }
            }
            return createBuilder<T>(copiedConfig)
        },

        debug: () => {
            console.log(`[${config.options.method}] ${config.label ? config.label : ""} Current Config:`, config);
            return createBuilder<T>(config);
        }
    }
)

const createHeadBuilder = (config: DenchConfig, label? : string): DenchHeadBuilder => {
    const { toJson, toFormData, ...builder }= createBuilder(config, label)
    const headRunner = createHeadRunner(config);

    
    //구조 분해 할당으로 특정 속성을 제거할 수 있다.
    return {
        ...builder as unknown as DenchHeadBuilder,
        ...headRunner
    }
}


const createGetBuilder = <T>(config: DenchConfig, label? : string): DenchGetBuilder<T> => {
    return createBuilder<T>(config, label);
    
}

const createCreateBuilder = <T>(config: DenchConfig): DenchCreateBuilder<T> => {
    return {
        ...createBuilder<T>(config) as DenchCreateBuilder<T>,
        sendJson: (data?: unknown) => createCreateBuilder<T>(sendJsonConfig(config, data)),
        sendForm: (data?: FormData) => createCreateBuilder<T>(sendFormConfig(config, data)),
        sendBlob: (data?: Blob) => createCreateBuilder<T>(sendBlobConfig(config, data)),
        sendUrlEncoded: (data?: DenchURLSearchParams) => createCreateBuilder<T>(sendUrlEncodedConfig(config, data)),
        sendRaw: (data?: BodyInit) => createCreateBuilder<T>(sendRawConfig(config, data)),
    }
}



export const DenchInstancePreset : Partial<Record<string, DenchInterface>> = {}



/**
 * Dench 빌더 함수
 * 
 * @param baseURL baseURL
 * 허용 URL은 다음과 같습니다.
 * - http://
 * - https://
 * - file://
 * - ftp://
 * - ws://
 * - wss://
 * @param label 빌더 레이블
 * @returns 
 */
export function dench<T>(baseURL: DenchHTTPURL, label? :string) : DenchInterface{

    if(label) DenchInstancePreset[label] = DenchInstancePreset[label] || dench(baseURL);

    const get = <T>(api:string = "") : DenchGetBuilder<T> => {

        const config : DenchConfig = {
            label : label,
            baseURL,
            api,
            URLNormalize : DenchURLNormalizeMode.BOUNDARY,
            options : {
                method : 'GET',
            }
        }
        return createGetBuilder<T>(config); 
    }


    const post = <T>(api:string = "") : DenchCreateBuilder<T>=>{

        const baseConfig : DenchConfig = {
            label : label,
            baseURL,
            api,
            URLNormalize : DenchURLNormalizeMode.BOUNDARY,
            options : {
                method : 'POST',
            }
        }
        return createCreateBuilder<T>(baseConfig);
    }


    const put = <T>(api:string = ""): DenchCreateBuilder<T> => {

        const baseConfig: DenchConfig = {
            label : label,
            baseURL,
            api,
            URLNormalize : DenchURLNormalizeMode.BOUNDARY,
            options: {
                method: 'PUT',
            }
        }
        return createCreateBuilder<T>(baseConfig);
    }


    const del = <T>(api:string = "") : DenchGetBuilder<T> => {

        const baseConfig : DenchConfig = {
            label : label,
            baseURL,
            api,
            URLNormalize : DenchURLNormalizeMode.BOUNDARY,
            options : {
                method : 'DELETE',
            }
        }
        return createGetBuilder<T>(baseConfig);
    }

    const patch = <T>(api:string ="") : DenchCreateBuilder<T> => {

        const baseConfig : DenchConfig = {
            label : label,
            baseURL,
            api,
            URLNormalize : DenchURLNormalizeMode.BOUNDARY,
            options : {
                method : 'PATCH',
            }
        }
        return createCreateBuilder<T>(baseConfig);
    }


    const head = (api:string = "") : DenchHeadBuilder => {
        const baseConfig : DenchConfig = {
            label : label,
            baseURL,
            api,
            URLNormalize : DenchURLNormalizeMode.BOUNDARY,
            options : {
                method : 'HEAD',
            }
        }
        return createHeadBuilder(baseConfig);
    }


    return {
        baseURL,
        get : get,
        post : post,
        patch: patch,
        put : put,
        delete : del,
        head : head
    }
}
