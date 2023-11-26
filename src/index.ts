import { CommonDIContext } from "./Services/DI"
import { ConsolePanel } from "./Workflows/ConsolePanel/ConsolePanel"
import { CopyrightWidget } from "./Workflows/CopyrightWidget/CopyrightWidget"
import { NavigationController } from "./Workflows/NavigationController/NavigationController"
import { RootCoordinatior } from "./Workflows/RootCoordinatior"
import './index.css'

const appElement = document.getElementById('App')!
appElement.className = 'app'

const diContext = CommonDIContext()

const navController = NavigationController()
appElement.appendChild(navController.root)

RootCoordinatior(navController, diContext)

const copyrightWidget = CopyrightWidget()
appElement.appendChild(copyrightWidget.root)

const consolePanel = ConsolePanel(diContext.themeService, diContext.consoleBus)
appElement.appendChild(consolePanel.root)
