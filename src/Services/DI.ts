import { SessionCreds } from "../Models/SessionCreds"
import { AuthService, IAuthService } from "./AuthService"
import { BackendService, IBackendService } from "./BackendService"
import { NetworkingService } from "./NetworkingService"
import { IStoragePersistenceService, StoragePersistenceService } from "./StoragePersistenceService"
import { IThemeService, ThemeService } from "./ThemeService"
import { IVisibilityChangeService, VisibilityChangeService } from "./VisibilityChangeService"
import { AuthLocalStorage, IAuthLocalStorage } from "./Auth/AuthLocalStorage"
import { FlagsDatabaseLocalStorage, IFlagsDatabaseLocalStorage } from "./FlagsDatabase/FlagsDatabaseLocalStorage"
import { IMoreMessagesOldLocalStorage, MoreMessagesOldLocalStorage } from "./MoreMessagesOld/MoreMessagesOldDatabaseLocalStorage"
import { IMoreMessageStagingService, MoreMessageStagingService } from "./MoreMessagesStaging/MoreMessageStagingService"
import { NeverSentMessagesStorage } from "./NeverSentMessages/NeverSentMessagesStorage"
import { INeverSentMessagesLocalStorage, NeverSentMessagesLocalStorage } from "./NeverSentMessages/NeverSentMessagesLocalStorage"
import { MoreMessageRequestService } from "./MoreMessagesStaging/MoreMessageRequestService"
import { IMoreMessagesLocalBackupService, MoreMessagesLocalBackupService } from "./MoreMessagesLocalBackup/MoreMessagesLocalBackupService"
import { IMoreMessagesLocalBackupStorage, MoreMessagesLocalBackupStorage } from "./MoreMessagesLocalBackup/MoreMessagesLocalBackupStorage"
import { ILastIdLocalStorage, LastIdLocalStorage } from "./MoreMessageLocalIdService/LocalLastIdDatabase"
import { MoreMessageLocalIdService } from "./MoreMessageLocalIdService/MoreMessageLocalIdService"

export interface ICommonDIContext {
    persistenceApiService: IStoragePersistenceService
    themeService: IThemeService
    flagsDatabaseStorage: IFlagsDatabaseLocalStorage
    moreMessagesOldLocalStorage: IMoreMessagesOldLocalStorage
    visibilityChangeService: IVisibilityChangeService
    authLocalStorage: IAuthLocalStorage
    authService: IAuthService
    backendService: IBackendService,
    moreMessagesLocalBackupStorage: IMoreMessagesLocalBackupStorage,
    moreMessagesLocalBackupService: IMoreMessagesLocalBackupService,
    neverSentMessageStorageService: INeverSentMessagesLocalStorage
    lastIdLocalStorage: ILastIdLocalStorage
}

export function CommonDIContext(): ICommonDIContext {
    const authLocalStorage = AuthLocalStorage()
    const networkingService = NetworkingService()
    const backendService = BackendService(networkingService)
    const authService: IAuthService = AuthService(backendService)
    const flagsDatabaseStorage = FlagsDatabaseLocalStorage()
    const moreMessagesOldLocalStorage = MoreMessagesOldLocalStorage()
    const moreMessagesLocalBackupStorage = MoreMessagesLocalBackupStorage()
    const moreMessagesLocalBackupService = MoreMessagesLocalBackupService(moreMessagesLocalBackupStorage)
    const neverSentMessageStorageService = NeverSentMessagesLocalStorage()
    const lastIdLocalStorage = LastIdLocalStorage()

    return {
        neverSentMessageStorageService: neverSentMessageStorageService,
        flagsDatabaseStorage: flagsDatabaseStorage,
        moreMessagesOldLocalStorage: moreMessagesOldLocalStorage,
        persistenceApiService: StoragePersistenceService(),
        themeService: ThemeService(),
        visibilityChangeService: VisibilityChangeService(),
        authLocalStorage,
        authService,
        backendService,
        moreMessagesLocalBackupStorage,
        moreMessagesLocalBackupService,
        lastIdLocalStorage
    }
}

export interface IAuthDIContext {
    moreMessageStagingService: IMoreMessageStagingService
}

export function AuthDIContext(di: ICommonDIContext, sessionCreds: SessionCreds): IAuthDIContext {
    const stagedMessageStorage = NeverSentMessagesStorage(di.neverSentMessageStorageService)
    const moreMessageRequestService = MoreMessageRequestService(di.backendService)
    const moreMessagesLocalIdService = MoreMessageLocalIdService(di.lastIdLocalStorage)
    const moreMessageStagingService = MoreMessageStagingService({
        sessionCreds,
        neverSentMessagesStorage: stagedMessageStorage, 
        moreMessageRequestService,
        moreMessagesLocalBackupService: di.moreMessagesLocalBackupService,
        moreMessageLocalIdService: moreMessagesLocalIdService
    })

    return {
        moreMessageStagingService
    }
}