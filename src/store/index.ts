import { getConfig , Config } from "../config"
import { stat as statCheck , walker , isValidModuleFile } from "../util/file"
import paths from "../paths"
import path from "path"
import { Stats } from "fs"
import requireUncached from "../util/require-uncached"
import { isPlainObject } from "lodash"
import { ENOENT } from "constants"
import madge from "madge"
import madgeConfig from "../util/madgeConfig"
import { checkIfAmockFile } from "../util/checkIfAmockFile"

/**
 * 模型： { modlePath: { ...// mock api } }
 * [ { module: '' , api: {  } , deps: undefined } ]
 */
const { appDirectory } = paths
interface GetMockDirs {
    (): Promise<string[]>
}
interface MockValueFunc {
    ( req: any , res: any ): void
}

export interface MockValueObj {
    [key: string]: any | MockValueFunc
}

export interface MockModule {
    moduleId: string
    api?: MockValueObj
    deps?: {
        [key: string]: any
    }
}

interface RecursiveDir {
    ( dir: string ): Promise< MockModule[] >
}

// 获取mock用户配置的mock目录
export const getMockDirs: GetMockDirs = async () => {
    try {
        const config: Config = await getConfig() ,
            { paths , baseUrl } = config ,
            mockDirs = paths.map( ( p: string ) => {
                return path.resolve( appDirectory , baseUrl , p )
            } )
        return mockDirs
    } catch ( e ) {
        console.warn( e )
        return []
    }
}

interface GetJSFileDefaultExports {
    ( path: string , stat?: Stats ): Promise< [ MockValueObj , MockValueObj ] | undefined >
}

export const getJSFileDefaultExports: GetJSFileDefaultExports = async ( path: string , stat?: Stats ) => {
    if ( stat === undefined ) {
        stat = await statCheck( path )
    }
    const isDir = stat.isDirectory()
    if ( !isDir ) {
        const isValid = isValidModuleFile( path )
        if ( isValid ) {
            const prevExports = require( path )
            const defaultExports = requireUncached( path )
            return [
                isPlainObject( defaultExports ) ? defaultExports : {} ,
                isPlainObject( prevExports ) ? prevExports : {}
            ]
        }
    }
    return undefined
}

// 递归mock目录，获取mock数据
const recursiveDir: RecursiveDir = async ( dir: string ) => {
    try {
        const dirStat = await statCheck( dir ) ,
            isDir = dirStat.isDirectory()
        if ( isDir ) {
            const files = await walker( dir ) ,
                modules = []
            for ( const filePath of files ) {
                const isAmockFile = checkIfAmockFile( filePath )
                if ( !isAmockFile ) {
                    continue
                }
                const moduleStruc: MockModule = {
                        moduleId: filePath ,
                        api: undefined ,
                        deps: undefined ,
                    }
                const defaultExports = require( filePath ) ,
                    deps = ( await madge( filePath , madgeConfig ) ).obj() ,
                    filePathSub = path.relative( appDirectory , filePath ) ,
                    hasDeps = deps[ filePathSub ] && deps[ filePathSub ].length > 0 ,
                    api = isPlainObject( defaultExports ) ? defaultExports : undefined
                if ( hasDeps ) {
                    Object.assign( moduleStruc , { deps } )
                }
                Object.assign( moduleStruc , { api } )
                modules.push( moduleStruc )
            }
            return modules
        }
    } catch ( e ) {
        if ( Math.abs( e.errno ) === ENOENT ) {
            // const { path } = e
            // log.warn( `mock目录不存在` , chalk.underline( path ) )
        } else {
            throw e
        }
    }
    return []
}

interface GetStore {
    (): Promise<MockModule[]>
}

// 获取所有的mock数据
export const getStore: GetStore = async () => {
    try {
        const mockDirs = await getMockDirs() ,
            promises: Promise<MockModule[]>[] = []
        for ( const mockDir of mockDirs ) {
            const promiseDirExports = recursiveDir( mockDir )
            promises.push( promiseDirExports )
        }
        const storeMocks = await Promise.all( promises ) ,
            store: MockModule[] = storeMocks.reduce( ( prev: any , next: MockModule[] ) => {
                return prev.concat( next )
            } , [] )
        return store
    } catch ( e ) {
        throw e
    }
}

