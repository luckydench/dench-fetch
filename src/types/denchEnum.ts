export enum HTTPCredentials {
    INCLUDE = "include",
    SAME_ORIGIN = "same-origin",
    OMIT = "omit"
}

export enum HTTPCache {
    NO_CACHE = "no-cache",
    NO_STORE = "no-store",
    RELOAD = "reload",
    FORCE_CACHE = "force-cache",
    ONLY_IF_CACHED = "only-if-cached",
    DEFAULT = "default"
}


export enum HTTPReferrerPolicy {
    NO_REFERRER = "no-referrer",
    NO_REFERRER_WHEN_DOWNGRADE = "no-referrer-when-downgrade",
    ORIGIN = "origin",
    ORIGIN_WHEN_CROSS_ORIGIN = "origin-when-cross-origin",
    SAME_ORIGIN = "same-origin",
    STRICT_ORIGIN = "strict-origin",
    STRICT_ORIGIN_WHEN_CROSS_ORIGIN = "strict-origin-when-cross-origin",
    UNSAFE_URL = "unsafe-url"
}

export enum HTTPRedirect {
    FOLLOW = "follow",
    ERROR = "error",
    MANUAL = "manual"
}

export enum HTTPMode{
    CORS = "cors",
    NO_CORS = "no-cors",
    SAME_ORIGIN = "same-origin",
}