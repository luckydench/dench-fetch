
import type { DenchURLNormalizeMode } from "./denchEnum"
import type { HTTPCache, HTTPCredentials, HTTPMode, HTTPRedirect, HTTPReferrerPolicy } from "./denchHTTPEnum"

interface DenchOptions extends RequestInit{
    method: string,
    credentials?: HTTPCredentials,
    signal?: AbortSignal,
    headers?: Record<string, string>,
    body?: BodyInit,
    cache?: HTTPCache
    mode?: HTTPMode
    redirect?: HTTPRedirect
    referrerPolicy?: HTTPReferrerPolicy
}


export interface DenchBaseConfig{
    label? : string,
    baseURL : string,
    api : string,
    errorcallback? : (error : unknown) => void,
    URLNormalize : DenchURLNormalizeMode, 
    options : DenchOptions
}

export interface DenchConfig extends DenchBaseConfig{
    abortController?: AbortController,   
    timeout? : number;
}