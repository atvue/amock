import Koa from "koa"
import { initGetCacheAndWatchDir } from "./store/setup"
import { getConfig } from "./config"
import mapMockApi from "./middleware/map-mock-api"
import setAmockKoaHeader from "./middleware/set-amock-koa-header"
import KoaBody from "koa-body"
import KoaStatic from "koa-static"
import paths from "./paths"
import path from "path"

const { amockRoot } = paths

const init = async () => {
    const config = await getConfig()
    await initGetCacheAndWatchDir()
    const app = new Koa() ,
        { port } = config ,
        publicPath = path.resolve( amockRoot , "public" )

    app.use( setAmockKoaHeader( "amock-koa/1.0" ) )
    app.use( KoaBody() )
    app.use( mapMockApi() )
    app.use( KoaStatic( publicPath ) )

    app.on( "error" , err => {
        console.warn( "amock server error" , err )
    } )
    app.listen( port , () => {
        console.log( `Amock开始监听` )
    } )
}

init()