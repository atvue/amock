import paths from "./paths"
import path from "path"
import { fileExist } from "./util/file"
import { merge } from "lodash"
export interface Config {
    baseUrl: string
    paths: string[]
}
interface GetConfig {
    (): Promise<Config> | Config
}

const configFile = "amock.json" ,
    { appDirectory } = paths ,
    getDefaultConfig: GetConfig = () => ( {
        baseUrl: "." ,
        paths: [ "./mock" ]
    } )

export const getConfig: GetConfig = async () => {
    const configPath = path.resolve( appDirectory , configFile ) ,
        defaultConfig = getDefaultConfig()
    try {
        await fileExist( configPath )
        const config = require( configPath ) ,
            calcConfig = merge( {} , defaultConfig , config )
        return calcConfig
    } catch ( e ) {
        console.warn( e )
        return defaultConfig
    }
}