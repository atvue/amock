import paths from "./paths"
import path from "path"
import { fileExist } from "./util/file"
import { merge } from "lodash"
import constants from "constants"
import chalk from "chalk"

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

let hasWarnedConfig = false
export const getConfig: GetConfig = async () => {
    const configPath = path.resolve( appDirectory , configFile ) ,
        defaultConfig = getDefaultConfig()
    try {
        await fileExist( configPath )
        const config = require( configPath ) ,
            calcConfig = merge( {} , defaultConfig , config )
        return calcConfig
    } catch ( e ) {
        if ( Math.abs( e.errno ) === constants.ENOENT ) {
            // 配置文件未找到
            if ( hasWarnedConfig === false ) {
                console.log(
                    chalk.yellow( `Amock:未定义配置文件，将使用默认配置` )
                )
                hasWarnedConfig = true
            }
        } else {
            console.warn( e )
        }
        return defaultConfig
    }
}
