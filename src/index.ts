import { FlagsCollectionHub } from "./Workflows/FlagsCollection/FlagsCollectionHub"
import './index.css'

const appElement = document.getElementById('App')!

const flagsCollectionHub = FlagsCollectionHub()

appElement.appendChild(flagsCollectionHub.root)
