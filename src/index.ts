import { DIContext } from "./Services/DI"
import { CopyrightWidget } from "./Workflows/CopyrightWidget/CopyrightWidget"
import { FlagsCollectionHub } from "./Workflows/FlagsCollection/FlagsCollectionHub"
import './index.css'

const appElement = document.getElementById('App')!

const diContext = DIContext()

const flagsCollectionHub = FlagsCollectionHub(diContext)
appElement.appendChild(flagsCollectionHub.root)

const copyrightWidget = CopyrightWidget()
appElement.appendChild(copyrightWidget.root)
