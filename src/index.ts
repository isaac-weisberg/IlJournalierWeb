import { CopyrightWidget } from "./Workflows/CopyrightWidget/CopyrightWidget"
import { FlagsCollectionHub } from "./Workflows/FlagsCollection/FlagsCollectionHub"
import './index.css'

const appElement = document.getElementById('App')!

const flagsCollectionHub = FlagsCollectionHub()
appElement.appendChild(flagsCollectionHub.root)

const copyrightWidget = CopyrightWidget()
appElement.appendChild(copyrightWidget.root)

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./service-worker.js");
 }