import type { DenchConfig } from "../types/dench";


export default async function denchfetcher<T>(url: string, config?: DenchConfig) :  Promise<Response> {

    let res : Response;
    let timeout : ReturnType<typeof setTimeout> | undefined;

    //console.log("Denchfetcher called with URL:", url, "and config:", config);

    
    if(config?.timeout && config.abortController){
        timeout  = setTimeout(()=>{
            config.abortController?.abort();  
        }, config.timeout);
    }
    else if(config?.timeout && !config.abortController){
        config.options.signal = AbortSignal.timeout(config.timeout);
    }

    try{
        res = await fetch(`${url}`, config?.options)
        if(!res.ok){
            throw new Error(`API request failed with status ${res.status}: ${res.statusText}`);
        }
    }
    catch(error){
        if(config && config.errorcallback) config.errorcallback(error);
        throw error;
    }
    finally{
        clearTimeout(timeout);
    }


    return res;
}