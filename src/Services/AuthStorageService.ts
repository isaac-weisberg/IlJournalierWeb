export interface IAuthStorageService {
    getAccessToken(): string|undefined
    setAccessToken(token: string|undefined): void
}

const accessTokenStorageKey = 'auth_accessToken'

export function AuthStorageService(): IAuthStorageService {
    function getAccessToken() {
        const accessToken = window.localStorage.getItem(accessTokenStorageKey)
        if (accessToken) {
            return accessToken
        }
        return undefined
    }

    function setAccessToken(token: string|undefined) {
        if (token) {
            window.localStorage.setItem(accessTokenStorageKey, token)
        } else {
            window.localStorage.removeItem(accessTokenStorageKey)
        }
    }

    return {
        getAccessToken,
        setAccessToken
    }
}