import { SessionCreds } from "../Models/SessionCreds"
import { AuthService, IAuthService } from "./AuthService"
import { AuthStorageService, IAuthStorageService } from "./AuthStorageService"
import { BackendService } from "./BackendService"
import { FlagsDatabaseStorageServiceV1, IFlagsDatabaseStorageService } from "./FlagsDatabaseStorageServiceV1"
import { IMoreMessagesStorageService, MoreMessagesStorageService } from "./MoreMessagesStorageService"
import { NetworkingService } from "./NetworkingService"
import { IStoragePersistenceService, StoragePersistenceService } from "./StoragePersistenceService"
import { IThemeService, ThemeService } from "./ThemeService"
import { TypedLocalStorageService } from "./TypedLocalStorageService"
import { IVisibilityChangeService, VisibilityChangeService } from "./VisibilityChangeService"

export interface ICommonDIContext {
    persistenceApiService: IStoragePersistenceService
    themeService: IThemeService
    flagsDatabaseStorage: IFlagsDatabaseStorageService
    moreMessagesDbStorage: IMoreMessagesStorageService
    visibilityChangeService: IVisibilityChangeService
    authStorageService: IAuthStorageService
    authService: IAuthService
}

export function CommonDIContext(): ICommonDIContext {
    const typedLocalStorageService = TypedLocalStorageService()
    const authStorageService = AuthStorageService()
    const networkingService = NetworkingService()
    const backendService = BackendService(networkingService)
    const authService: IAuthService = AuthService(backendService)
    return {
        flagsDatabaseStorage: FlagsDatabaseStorageServiceV1(typedLocalStorageService),
        moreMessagesDbStorage: MoreMessagesStorageService(typedLocalStorageService),
        persistenceApiService: StoragePersistenceService(),
        themeService: ThemeService(),
        visibilityChangeService: VisibilityChangeService(),
        authStorageService,
        authService
    }
}

export interface IAuthDIContext {

}

export function AuthDIContext(di: ICommonDIContext, sessionCreds: SessionCreds): IAuthDIContext {


    return {

    }
}