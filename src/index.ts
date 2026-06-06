import { dench } from './denchfetch/dench';
import { DenchAuthType } from './types/denchEnum';
import { HTTPCache } from './types/denchHTTPEnum';

export { dench } from './denchfetch/dench';
export { default as denchfetcher } from './denchfetch/denchfetcher';
export { HTTPCredentials, HTTPMode, HTTPReferrerPolicy, HTTPCache, HTTPRedirect } from './types/denchHTTPEnum';
export { DenchAuthType } from './types/denchEnum';
export type {  DenchRunner }  from './types/denchRunner';
export type { DenchBuilder, DenchCreateBuilder, DenchGetBuilder } from './types/denchBuilder';
export type { DenchConfig } from './types/denchConfig';
export type { DenchInterface, DenchHTTPURL } from './types/dench';