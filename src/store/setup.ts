import { refreshCache , updateCache , delSomeCache , delKeyCache } from "./db"
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
    const [ obj , prevObj ] = await getJSFileDefaultExports( path , stats ) ,
        deledkeys = diffKeys( obj , prevObj )
    updateCache( obj )
    delKeyCache( deledkeys )
}

function delFile ( path: string ) {
    // 利于require函数的缓存，可以在文件被删之后，获取之前的模块导出内容，进行缓存删除
    const moduleExports = require( path )
    delSomeCache( moduleExports )
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
