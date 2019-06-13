import paths from "./paths"
import path from "path"
import { fileExist } from "./util/file"
import { merge } from "lodash"
import requireUncached from "./util/require-uncached"
export interface Config {
    port?: number
    baseUrl: string
    paths: string[]
    proxy?: any[]
}
interface GetConfig {
    (): Promise<Config> | Config
}

const configFile = "amockrc.js" ,
    { appDirectory } = paths ,
    getDefaultConfig: GetConfig = () => ( {
        port: 8002 ,
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
