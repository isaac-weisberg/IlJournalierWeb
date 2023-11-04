import { SessionCreds } from "../Models/SessionCreds"
import { AuthService, IAuthService } from "./AuthService"
import { BackendService, IBackendService } from "./BackendService"
import { NetworkingService } from "./NetworkingService"
import { IStoragePersistenceService, StoragePersistenceService } from "./StoragePersistenceService"
import { IThemeService, ThemeService } from "./ThemeService"
import { IVisibilityChangeService, VisibilityChangeService } from "./VisibilityChangeService"
import { AuthLocalStorage, IAuthLocalStorage } from "./Auth/AuthLocalStorage"
import { FlagsDatabaseLocalStorage, IFlagsDatabaseLocalStorage } from "./FlagsDatabase/FlagsDatabaseLocalStorage"
import { IMoreMessagesOldDatabaseLocalStorage, MoreMessagesOldDatabaseLocalStorage } from "./MoreMessagesOld/MoreMessagesOldDatabaseLocalStorage"
import { IMoreMessageStagingService, MoreMessageStagingService } from "./MoreMessages/MoreMessageStagingService"
import { StagedMessageStorage } from "./MoreMessages/StagedMessageStorage"
import { NeverSentMessageStorageService } from "./MoreMessages/NeverSentMessageStorageService"
import { MoreMessageRequestService } from "./MoreMessages/MoreMessageRequestService"

export interface ICommonDIContext {
    persistenceApiService: IStoragePersistenceService
    themeService: IThemeService
    flagsDatabaseStorage: IFlagsDatabaseLocalStorage
    moreMessagesDbStorage: IMoreMessagesOldDatabaseLocalStorage
    visibilityChangeService: IVisibilityChangeService
    authLocalStorage: IAuthLocalStorage
    authService: IAuthService
    backendService: IBackendService
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
        authService,
        backendService
    }
}

export interface IAuthDIContext {
    moreMessageStagingService: IMoreMessageStagingService
}

export function AuthDIContext(di: ICommonDIContext, sessionCreds: SessionCreds): IAuthDIContext {
    const neverSentMessageStorageService = NeverSentMessageStorageService()
    const stagedMessageStorage = StagedMessageStorage(neverSentMessageStorageService)
    const moreMessageRequestService = MoreMessageRequestService(di.backendService)
    const moreMessageStagingService = MoreMessageStagingService(sessionCreds, stagedMessageStorage, moreMessageRequestService)

    return {
        moreMessageStagingService
    }
}