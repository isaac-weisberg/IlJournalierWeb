import { CommonDIContext } from "./Services/DI"
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
