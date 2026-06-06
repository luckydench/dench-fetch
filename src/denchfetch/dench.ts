import { 
    credentialsConfig, abortConfig, authConfig, 
    timeoutConfig, sendJsonConfig, 
    sendFormConfig, sendBlobConfig, 
    modeConfig, 
    cacheConfig,
    referrerPolicyConfig,
    redirectConfig,
    errorConfig, } from "./denchConfigModule"
import { runfetch, toFormData, toJson } from "./denchRunner";
import { boundaryNormalize, hardNormalize } from "./denchUtils";
import type { HTTPCache, HTTPCredentials, HTTPMode, HTTPRedirect, HTTPReferrerPolicy } from "../types/denchHTTPEnum";
import type { DenchCreateBuilder, DenchGetBuilder } from "../types/denchBuilder";
import type { DenchConfig } from "../types/denchConfig";
import type { DenchAuthType } from "../types/denchEnum";
import type { DenchInterface, DenchHTTPURL } from "../types/dench";




const createGetBuilder = <T>(config: DenchConfig): DenchGetBuilder<T> => ({
    config: config,
    toResponse: () => runfetch<T>(config),
    toJson: () => toJson(config),
    toFormData: () => toFormData(config),
    error: (callback: (error: unknown) => void) => {
        errorConfig(config, callback);
        return createGetBuilder<T>(config);
    },
    credentials: (credentials: HTTPCredentials) => createGetBuilder<T>(credentialsConfig(config, credentials)),
    abort: (controller: AbortController) => createGetBuilder<T>(abortConfig(config, controller)),
    auth: (token: string, type?: DenchAuthType) => createGetBuilder<T>(authConfig(config, token, type)),
    timeout: (ms: number) => createGetBuilder<T>(timeoutConfig(config, ms)),
    cache : (cache : HTTPCache) => createGetBuilder<T>(cacheConfig(config, cache)),
    referrerPolicy: (policy : HTTPReferrerPolicy) => createGetBuilder<T>(referrerPolicyConfig(config, policy)),
    mode: (mode : HTTPMode) => createGetBuilder<T>(modeConfig(config, mode)),
    redirect: (redirect : HTTPRedirect) => createGetBuilder<T>(redirectConfig(config, redirect)),
    api : <P = T>(api : string) => createGetBuilder<P>({...config, api}),
    boundaryNormalize: () => {
        const { baseURL, apiURL } = boundaryNormalize(config.baseURL, config.api);

        const newConfig = {
            ...config,
            baseURL,
            api: apiURL
        }
        return createGetBuilder<T>(newConfig);
    },
    hardNormalize: () => {
        const { baseURL, apiURL } = hardNormalize(config.baseURL, config.api);
        const newConfig = {
            ...config,
            baseURL,
            api: apiURL
        }
        return createGetBuilder<T>(newConfig);
    }
})


const createPostBuilder = <T>(config: DenchConfig): DenchCreateBuilder<T> => ({
    config: config,
    toResponse: () => runfetch<T>(config),
    toJson: () => toJson(config),
    toFormData: () => toFormData(config),
    sendJson: () => createPostBuilder<T>(sendJsonConfig(config)),
    sendForm: () => createPostBuilder<T>(sendFormConfig(config)),
    sendBlob: () => createPostBuilder<T>(sendBlobConfig(config)),
    error: (callback: (error: unknown) => void) => {
        errorConfig(config, callback);
        return createPostBuilder<T>(config);
    },
    credentials: (credentials: HTTPCredentials) => createPostBuilder<T>(credentialsConfig(config, credentials)),
    abort: (controller: AbortController) => createPostBuilder<T>(abortConfig(config, controller)),
    auth: (token: string, type?: DenchAuthType) => createPostBuilder<T>(authConfig(config, token, type)),
    mode: (mode: HTTPMode) =>  createPostBuilder<T>(modeConfig(config, mode)),
    timeout: (ms: number) => createPostBuilder<T>(timeoutConfig(config, ms)),
    cache : (cache : HTTPCache) => createPostBuilder<T>(cacheConfig(config, cache)),
    referrerPolicy: (policy : HTTPReferrerPolicy) => createPostBuilder<T>(referrerPolicyConfig(config, policy)),
    redirect: (redirect : HTTPRedirect) => createPostBuilder<T>(redirectConfig(config, redirect)),
    api : <P=T>(api : string) => createPostBuilder<P>({...config, api}),
    boundaryNormalize: () => {
        const { baseURL, apiURL } = boundaryNormalize(config.baseURL, config.api);
        config.baseURL = baseURL;
        config.api = apiURL;
        return createPostBuilder<T>(config);
    },
    hardNormalize: () => {
        const { baseURL, apiURL } = hardNormalize(config.baseURL, config.api);
        config.baseURL = baseURL;
        config.api = apiURL;
        return createPostBuilder<T>(config);
    }
})



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
            baseURL,
            api,
            options : {
                method : 'GET',
            }
        }
        return createGetBuilder<T>(config); 
    }


    const post = <T>(api:string = "") : DenchCreateBuilder<T>=>{

        const baseConfig : DenchConfig = {
            baseURL,
            api,
            options : {
                method : 'POST',
            }
        }
        return createPostBuilder<T>(baseConfig);
    }


    const put = <T>(api:string = ""): DenchCreateBuilder<T> => {

        const baseConfig: DenchConfig = {
            baseURL,
            api,
            options: {
                method: 'PUT',
            }
        }
        return createPostBuilder<T>(baseConfig);
    }


    const del = <T>(api:string = "") : DenchGetBuilder<T> => {

        const baseConfig : DenchConfig = {
            baseURL,
            api,
            options : {
                method : 'DELETE',
            }
        }
        return createGetBuilder<T>(baseConfig);
    }

    return {
        baseURL,
        get : get,
        post : post,
        put : put,
        delete : del
    }
}
