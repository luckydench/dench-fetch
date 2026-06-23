export const HTTPCredentials = {
    INCLUDE : "include",
    SAME_ORIGIN : "same-origin",
    OMIT : "omit"
} as const;

export type HTTPCredentials = typeof HTTPCredentials[keyof typeof HTTPCredentials];

export const HTTPCache = {
    NO_CACHE : "no-cache",
    NO_STORE : "no-store",
    RELOAD : "reload",
    FORCE_CACHE : "force-cache",
    ONLY_IF_CACHED : "only-if-cached",
    DEFAULT : "default"
} as const;

export type HTTPCache = typeof HTTPCache[keyof typeof HTTPCache];


export const HTTPReferrerPolicy = {
    NO_REFERRER : "no-referrer",
    NO_REFERRER_WHEN_DOWNGRADE : "no-referrer-when-downgrade",
    ORIGIN : "origin",
    ORIGIN_WHEN_CROSS_ORIGIN : "origin-when-cross-origin",
    SAME_ORIGIN : "same-origin",
    STRICT_ORIGIN : "strict-origin",
    STRICT_ORIGIN_WHEN_CROSS_ORIGIN : "strict-origin-when-cross-origin",
    UNSAFE_URL : "unsafe-url"
} as const;

export type HTTPReferrerPolicy = typeof HTTPReferrerPolicy[keyof typeof HTTPReferrerPolicy];




export const HTTPRedirect = {
    FOLLOW : "follow",
    ERROR : "error",
    MANUAL : "manual"
} as const;

export type HTTPRedirect = typeof HTTPRedirect[keyof typeof HTTPRedirect];


export const HTTPMode = {
    CORS : "cors",
    NO_CORS : "no-cors",
    SAME_ORIGIN : "same-origin",
} as const;

export type HTTPMode = typeof HTTPMode[keyof typeof HTTPMode];