import { getConfig , Config } from "./config"
import { stat } from "./util/file"
import path from "path"
import paths from "./paths"
import { Stats } from "fs"

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
interface Mock {
    [path: string]: MockValueObj | MockValueFunc
}

interface RecursiveDir {
    ( dir: string ): Promise< Mock | undefined >
}

const getMockDirs: GetMockDirs = async () => {
    try {
        const config: Config = await getConfig() ,
            { paths , baseUrl } = config ,
            mockDirs = paths.map( ( p: string ) => {
                return path.resolve( appDirectory , baseUrl , p )
            } )
        return mockDirs
    } catch ( e ) {
        return []
    }
}

const recursiveDir: RecursiveDir = async ( dir: string ) => {
    try {
        const dirStat = await stat( dir ) ,
            isDir = dirStat.isDirectory()
        if ( isDir ) {
            console.log( dir )
        }
    } catch ( e ) {

    }
    return undefined
}


export const getStore = async () => {
    try {
        const mockDirs = await getMockDirs()
        for ( const mockDir of mockDirs ) {
            recursiveDir( mockDir )
        }
    } catch ( e ) {
        throw e
    }
}

