export interface IStoragePersistanceService {
    isPersisted(): Promise<boolean>
    requestPersistence(): Promise<boolean>
}

export function StoragePersistanceService(): IStoragePersistanceService {
    async function isPersisted(): Promise<boolean> {
        if (navigator.storage && navigator.storage.persisted) {
            return await navigator.storage.persisted()
        }
        return false
    }

    async function requestPersistence(): Promise<boolean> {
        if (navigator.storage && navigator.storage.persist) {
            return await navigator.storage.persist()
        }
        return false
    }

    requestPersistence()

    return {
        requestPersistence,
        isPersisted
    }
}