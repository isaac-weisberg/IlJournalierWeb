export interface IAuthStorageService {
    getAccessToken(): string|undefined
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

    return {
        getAccessToken
    }
}