import { FlagsDatabaseStorageServiceV1, IFlagsDatabaseStorageService } from "./FlagsDatabaseStorageServiceV1"
import { IMoreMessagesStorageService, MoreMessagesStorageService } from "./MoreMessagesStorageService"
import { IStoragePersistenceService, StoragePersistenceService } from "./StoragePersistenceService"
import { IThemeService, ThemeService } from "./ThemeService"
import { IVisibilityChangeService, VisibilityChangeService } from "./VisibilityChangeService"

export interface IDIContext {
    persistenceApiService: IStoragePersistenceService
    themeService: IThemeService
    flagsDatabaseStorage: IFlagsDatabaseStorageService
    moreMessagesDbStorage: IMoreMessagesStorageService
    visibilityChangeService: IVisibilityChangeService
}

export function DIContext(): IDIContext {
    return {
        flagsDatabaseStorage: FlagsDatabaseStorageServiceV1(),
        moreMessagesDbStorage: MoreMessagesStorageService(),
        persistenceApiService: StoragePersistenceService(),
        themeService: ThemeService(),
        visibilityChangeService: VisibilityChangeService()
    }
}