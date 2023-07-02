import { FlagsCollectionPresenter } from "./Workflows/FlagsCollection/FlagsCollectionPresenter"
import { FlagsCollectionService } from "./Workflows/FlagsCollection/FlagsCollectionService"
import { FlagsCollectionView } from "./Workflows/FlagsCollection/FlagsCollectionView"
import './index.css'

const appElement = document.getElementById('App')!
const flagsCollectionService = FlagsCollectionService()
const flagCollectionPresenter = FlagsCollectionPresenter(flagsCollectionService)

const flagCollectionView = FlagsCollectionView(flagCollectionPresenter)

appElement.appendChild(flagCollectionView.root)
