import { SessionCreds } from "../Models/SessionCreds"
import { AuthService, IAuthService } from "./AuthService"
import { BackendService } from "./BackendService"
import { NetworkingService } from "./NetworkingService"
import { IStoragePersistenceService, StoragePersistenceService } from "./StoragePersistenceService"
import { IThemeService, ThemeService } from "./ThemeService"
import { IVisibilityChangeService, VisibilityChangeService } from "./VisibilityChangeService"
import { AuthLocalStorage, IAuthLocalStorage } from "./Auth/AuthLocalStorage"
import { FlagsDatabaseLocalStorage, IFlagsDatabaseLocalStorage } from "./FlagsDatabase/FlagsDatabaseLocalStorage"
import { IMoreMessagesOldDatabaseLocalStorage, MoreMessagesOldDatabaseLocalStorage } from "./MoreMessagesOld/MoreMessagesOldDatabaseLocalStorage"

export interface ICommonDIContext {
    persistenceApiService: IStoragePersistenceService
    themeService: IThemeService
    flagsDatabaseStorage: IFlagsDatabaseLocalStorage
    moreMessagesDbStorage: IMoreMessagesOldDatabaseLocalStorage
    visibilityChangeService: IVisibilityChangeService
    authLocalStorage: IAuthLocalStorage
    authService: IAuthService
}

export function CommonDIContext(): ICommonDIContext {
    const authLocalStorage = AuthLocalStorage()
    const networkingService = NetworkingService()
    const backendService = BackendService(networkingService)
    const authService: IAuthService = AuthService(backendService)
    const flagsDatabaseStorage = FlagsDatabaseLocalStorage()
    const moreMessagesOldLocalStorage = MoreMessagesOldDatabaseLocalStorage()
    return {
        flagsDatabaseStorage: flagsDatabaseStorage,
        moreMessagesDbStorage: moreMessagesOldLocalStorage,
        persistenceApiService: StoragePersistenceService(),
        themeService: ThemeService(),
        visibilityChangeService: VisibilityChangeService(),
        authLocalStorage,
        authService
    }
}

export interface IAuthDIContext {

}

export function AuthDIContext(di: ICommonDIContext, sessionCreds: SessionCreds): IAuthDIContext {


    return {

    }
}