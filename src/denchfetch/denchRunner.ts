import type { DenchConfig } from "../types/dench";
import denchfetcher from "./denchfetcher";

export function runfetch<T>(config: DenchConfig): Promise<Response> {
    return denchfetcher<T>(`${config.baseURL}${config.api}`, config);
}


export const toJson = async <T>(config : DenchConfig)  => {
    return runfetch<T>(config).then((res) => {
        return res.json() as T;
    })
}

export const toObject = async <T>(config: DenchConfig) => {
    return runfetch<T>(config).then((res) => {
        return res as unknown as T;
    })
}


export const toFormData = async <T>(config: DenchConfig) => {
    return runfetch<T>(config).then((res) => {
        return res.formData();
    }
)
}