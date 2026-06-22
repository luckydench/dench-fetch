
import {  type DenchConfig } from "../types/denchConfig";
import { DenchURLNormalizeMode } from "../types/denchEnum";
import denchfetcher from "./denchfetcher";
import { boundaryNormalize, hardNormalize } from "./denchUtils";

export function runfetch<T>(config: DenchConfig): Promise<Response> {

    switch (config.URLNormalize){
        case DenchURLNormalizeMode.BOUNDARY :
            const { baseURL : basehard, apiURL : apihard } = boundaryNormalize(config.baseURL, config.api);
            config.baseURL = basehard;
            config.api = apihard;
            break;
            
        case DenchURLNormalizeMode.HARD :
            const { baseURL : base, apiURL : api } = hardNormalize(config.baseURL, config.api);
            config.baseURL = base;
            config.api = api;
            break;

        case DenchURLNormalizeMode.NONE :
            break;

        default :
            const a : never = config.URLNormalize;
            throw new Error(`Unknown URLNormalize mode: ${a}`);
    }


    return denchfetcher<T>(`${config.baseURL}${config.api}${config.params ? config.params : ""}`, config);
}


export const toJson = async <T>(config : DenchConfig)  => {
    return runfetch<T>(config).then((res) => {
        return res.json() as T;
    })
}


export const toFormData = async <T>(config: DenchConfig) => {
    return runfetch<T>(config).then((res) => {
        return res.formData();
    }
)
}