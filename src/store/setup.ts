import { refreshCache , updateCache , delCache , delKeyCache , cache } from "./db"
import { getMockDirs , getJSFileDefaultExports } from "./index"
import chokidar from "chokidar"
import { Stats } from "fs"
import diffKeys from "../util/diffKeys"


export const initGetCacheAndWatchDir = async function initGetCacheAndWatchDir() {
    await Promise.all( [
        refreshCache() ,
        watchMockDirs() ,
    ] )
}

async function watchFile( path: string , stats?: Stats ) {
    const [ obj , prevObj ] = await getJSFileDefaultExports( path , stats ) || [ undefined , undefined ] ,
        deledkeys = diffKeys( obj , prevObj )
    updateCache( path , obj )
    delKeyCache( path , deledkeys )
}

function delFile ( path: string ) {
    delCache( path )
}

async function watchMockDirs() {
    const mockDirs = await getMockDirs()
    const watcher = chokidar.watch( mockDirs , {
        ignored: /(^|[\/\\])\../ ,
        ignoreInitial: true ,
        persistent: true ,
        awaitWriteFinish: {
            stabilityThreshold: 1000 ,
            pollInterval: 200 ,
        }
    } )
    watcher
        .on( "add" , watchFile )
        .on( "unlink" , delFile )
        .on( "addDir" , refreshCache )
        .on( "unlinkDir" , refreshCache )
        .on( "change" , watchFile )
        .on( "error" , error => {
            console.warn( `Watcher error: ${error}` )
        } )
    return watcher
}
