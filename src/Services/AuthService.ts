import { SessionCreds } from "../Models/SessionCreds"
import { e, wA } from "../Util/ErrorExtensions"
import { IBackendService } from "./BackendService"

export interface IAuthService {
    login(loginInfo: string): Promise<SessionCreds>
}


const malformedLoginInfoError = e('malformed login info')

export function AuthService(backendService: IBackendService): IAuthService {
    return {
        async login(loginInfo: string) {
            const splittedStrings = loginInfo.split('@')

            if (splittedStrings.length != 2) {
                throw malformedLoginInfoError
            }

            const part1 = splittedStrings[0]
            const part2 = splittedStrings[1]

            if (part1.length == 0 || part2.length == 0) {
                throw malformedLoginInfoError
            }

            const resp = await wA('login call failed', async () => {
                return await backendService.login(part1)
            })

            return {
                accessToken: resp.accessToken,
                saultGoodman: part2
            }
        }
    }
}