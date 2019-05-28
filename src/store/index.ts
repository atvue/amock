import { getConfig , Config } from "../config"
import { stat as statCheck , walker , isValidModuleFile } from "../util/file"
import paths from "../paths"
import path from "path"
import { Stats } from "fs"
import requireUncached from "../util/require-uncached"

const { appDirectory } = paths
interface GetMockDirs {
    (): Promise<string[]>
}

interface MockValueObj {
    [key: string]: any
}

interface MockValueFunc {
    ( req: any , res: any ): void
}
export interface Mock {
    [path: string]: MockValueObj | Array<any> | MockValueFunc | string | number | boolean
}

interface RecursiveDir {
    ( dir: string ): Promise< Mock | undefined >
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
    ( path: string , stat?: Stats ): Promise< Mock | undefined >
}

export const getJSFileDefaultExports: GetJSFileDefaultExports = async ( path: string , stat?: Stats ) => {
    if ( stat === undefined ) {
        stat = await statCheck( path )
    }
    const isDir = stat.isDirectory()
    if ( !isDir ) {
        const isValid = isValidModuleFile( path )
        if ( isValid ) {
            const defaultExports = requireUncached( path )
            return defaultExports
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
                rootDirExports = files.length > 0 ? {} : undefined
            for ( const filePath of files ) {
                const defaultExports = require( filePath )
                Object.assign( rootDirExports , defaultExports )
            }
            return rootDirExports
        }
    } catch ( e ) {
        console.warn( e )
    }
    return undefined
}

interface GetStore {
    (): Promise<Mock>
}

// 获取所有的mock数据
export const getStore: GetStore = async () => {
    try {
        const mockDirs = await getMockDirs() ,
            promises: Promise<Mock>[] = []
        for ( const mockDir of mockDirs ) {
            const promiseDirExports = recursiveDir( mockDir )
            promises.push( promiseDirExports )
        }
        const storeMocks = await Promise.all( promises ) ,
            storeMockMap = storeMocks.reduce( ( prev: any , next: Mock ) => {
                if ( next === undefined ) {
                    return prev
                }
                return Object.assign( prev , next )
            } , {} )
        return storeMockMap
    } catch ( e ) {
        throw e
    }
}

