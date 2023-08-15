import { DIContext } from "./Services/DI"
import { CopyrightWidget } from "./Workflows/CopyrightWidget/CopyrightWidget"
import { FlagsCollectionViewController } from "./Workflows/FlagsCollection/FlagsCollectionViewController"
import './index.css'

const appElement = document.getElementById('App')!

const diContext = DIContext()

const flagsCollectionViewController = FlagsCollectionViewController(diContext)
appElement.appendChild(flagsCollectionViewController.root)

const copyrightWidget = CopyrightWidget()
appElement.appendChild(copyrightWidget.root)
