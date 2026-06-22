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
import { runfetch, toFormData, toJson } from "./denchRunner";
import type { HTTPCache, HTTPCredentials, HTTPMode, HTTPRedirect, HTTPReferrerPolicy } from "../types/denchHTTPEnum";
import type { DenchCreateBuilder, DenchGetBuilder } from "../types/denchBuilder";
import { type DenchConfig } from "../types/denchConfig";
import { DenchURLNormalizeMode, type DenchAuthType } from "../types/denchEnum";
import type { DenchInterface, DenchHTTPURL, DenchURLSearchParams } from "../types/dench";


const createBuilder = <T>(config  : DenchConfig, label? : string) : DenchCreateBuilder<T> | DenchGetBuilder<T> => (
    {
        config: config,
        toResponse: () => runfetch<T>(config),
        toJson: () => toJson(config),
        toFormData: () => toFormData(config),
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
            return createBuilder<T>(newConfig);
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

const createGetBuilder = <T>(config: DenchConfig, label? : string): DenchGetBuilder<T> => {
    return createBuilder<T>(config, label);
}

const createPostBuilder = <T>(config: DenchConfig): DenchCreateBuilder<T> => {
    return {
        ...createBuilder<T>(config) as DenchCreateBuilder<T>,
        sendJson: (data?) => createPostBuilder<T>(sendJsonConfig(config, data)),
        sendForm: (data?) => createPostBuilder<T>(sendFormConfig(config, data)),
        sendBlob: (data?) => createPostBuilder<T>(sendBlobConfig(config, data)),
        sendUrlEncoded: (data?) => createPostBuilder<T>(sendUrlEncodedConfig(config, data)),
        sendRaw: (data?) => createPostBuilder<T>(sendRawConfig(config, data)),
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
        return createPostBuilder<T>(baseConfig);
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
        return createPostBuilder<T>(baseConfig);
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
        return createPostBuilder<T>(baseConfig);
    }

    return {
        baseURL,
        get : get,
        post : post,
        patch: patch,
        put : put,
        delete : del,
    }
}
