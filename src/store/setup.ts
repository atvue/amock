import { refreshCache , updateCache , delCache , delKeyCache , getModulesBeDepended } from "./db"
import { getMockDirs , getJSFileDefaultExports } from "./index"
import chokidar from "chokidar"
import { Stats } from "fs"
import diffKeys from "../util/diffKeys"
import requireUncached from "../util/require-uncached"


export const initGetCacheAndWatchDir = async function initGetCacheAndWatchDir() {
    await Promise.all( [
        refreshCache() ,
        watchMockDirs() ,
    ] )
}

async function watchFile( path: string , stats?: Stats ) {
    const deps = getModulesBeDepended( path ) ,
        paths = [ path ].concat( deps ) // 重要 ，优先更新更改的
    for ( const path of paths ) {
        const [ obj , prevObj ] = await getJSFileDefaultExports( path , stats ) || [ undefined , undefined ] ,
            deledkeys = diffKeys( obj , prevObj )
        updateCache( path , obj )
        delKeyCache( path , deledkeys )
    }
}

function delFile ( path: string ) {
    delCache( path )
    requireUncached( path )
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
