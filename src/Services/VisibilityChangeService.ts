import { Bus, IBus } from "../Util/Bus"

export interface IVisibilityChangeService {
    bus: IBus<DocumentVisibilityState>
}

export function VisibilityChangeService(): IVisibilityChangeService {
    const bus = Bus<DocumentVisibilityState>()

    document.addEventListener('visibilitychange', function() {
        const state = document.visibilityState
        bus.post(state)
    })

    return {
        bus
    }
}