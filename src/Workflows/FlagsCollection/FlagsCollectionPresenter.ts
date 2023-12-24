import { IMoreMessagesLocalBackupService } from "../../Services/MoreMessagesLocalBackup/MoreMessagesLocalBackupService"
import { IMoreMessageStagingService } from "../../Services/MoreMessagesStaging/MoreMessageStagingService"
import { IThemeService } from "../../Services/ThemeService"
import { Bus, IBus } from "../../Util/Bus"
import { localUser } from "../../Util/Const"
import { DevPanelPresenter, IDevPanelPresenter } from "../DevPanel/DevPanelPresenter"
import { IMessageListViewDataSource } from "../MessagesViewer/View/MessageListView"
import { IMessageViewModel } from "../MessagesViewer/View/MessageView"
import { FlagModel, IFlagsCollectionSessionModel } from "./FlagsCollectionSessionModel"

export interface IFlagsCollectionPresenter {
    flags(): FlagModel[]
    setEnabled(id: string, enabled: boolean): void
    addFlag(id: string): FlagModel | undefined
    addMoreMessage: (value: string) => void
    onFlagsUpdated: IBus<void>,
    devPanelPresenter: IDevPanelPresenter
    messagesListDataSource: IMessageListViewDataSource
}

interface FlagsCollectionPresenterDI {
    flagsCollectionSessionModel: IFlagsCollectionSessionModel,
    moreMessageStagingService: IMoreMessageStagingService,
    themeService: IThemeService,
    moreMessagesLocalBackupService: IMoreMessagesLocalBackupService
}

export function FlagsCollectionPresenter(
    devPanelPresenter: IDevPanelPresenter,
    di: FlagsCollectionPresenterDI
): IFlagsCollectionPresenter {
    const flagsCollectionSessionModel = di.flagsCollectionSessionModel

    let flags = flagsCollectionSessionModel.flags()

    function getFlags(): FlagModel[] {
        return flags
    }

    function setEnabled(id: string, isEnabled: boolean) {
        const flag = flags.find((flag => { return flag.id == id }))
        if (flag) {
            flag.isEnabled = true
            flagsCollectionSessionModel.setFlagEnabled(id, isEnabled)
        }
    }

    const onFlagsUpdatedBus = Bus<void>()

    flagsCollectionSessionModel.onFlagsUpdatedBus.addHandler(() => {
        flags = flagsCollectionSessionModel.flags()
        onFlagsUpdatedBus.post()
    })

    const messagesForReader = di.moreMessagesLocalBackupService.getMessages(localUser)

    let prevDayMonthYear: { d: number, m: number, y: number } |undefined
    const viewModels: IMessageViewModel[] = []
    for (let i = 0; i < messagesForReader.length; i++) {
        const message = messagesForReader[i]
        const date = new Date(message.unixSeconds * 1000)

        const d = date.getDate()
        const m = date.getMonth()
        const y = date.getFullYear()

        const shouldInsertDateLabel = !prevDayMonthYear 
            || d != prevDayMonthYear.d 
            || m != prevDayMonthYear.m
            || y != prevDayMonthYear.y

        if (shouldInsertDateLabel) {
            const dateLabel = `${d} ${mounthToString(date.getMonth())}`

            viewModels.push({
                kind: 'IMessageViewModelKindDateLabel',
                dateLabel: dateLabel
            })
        }
        if (prevDayMonthYear) {
            prevDayMonthYear.d = d
            prevDayMonthYear.m = m
            prevDayMonthYear.y = y
        } else {
            prevDayMonthYear = { d, m, y }
        }


        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')

        const formattedTime = `${hours}:${minutes}`

        viewModels.push({
            kind: 'IMessageViewModelKindMessage',
            message: message.msg,
            timeText: formattedTime
        })
    }

    const messagesListDataSource: IMessageListViewDataSource = {
        numberOfItems() {
            return viewModels.length
        },
        itemForIndex(index) {
            return viewModels[index]
        },
    }

    return {
        flags: getFlags,
        setEnabled,
        addFlag(id: string): FlagModel | undefined {
            const addedFlag = flagsCollectionSessionModel.addFlag(id)
            if (addedFlag) {
                flags.push(addedFlag)
            }
            return addedFlag
        },
        addMoreMessage(value) {
            const unixSeconds = Math.round(new Date().getTime() / 1000)
            const message = {
                unixSeconds: unixSeconds,
                msg: value
            }
            di.moreMessageStagingService.stageMessage(message)
        },
        onFlagsUpdated: onFlagsUpdatedBus,
        devPanelPresenter: devPanelPresenter,
        messagesListDataSource
    }
}

function mounthToString(m: number): string {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m]
        || 'Shittember'
}