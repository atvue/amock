import Koa from "koa"
import { initGetCacheAndWatchDir } from "./store/setup"
import mapMockApi from "./middleware/map-mock-api"
import KoaBody from "koa-body"

const init = async () => {
    await initGetCacheAndWatchDir()
    const app = new Koa()
    app.use( KoaBody() )
    app.use( mapMockApi )
    app.on( "error" , err => {
        console.warn( "amock server error" , err )
    } )
    app.listen( 3000 , () => {
        console.log( `Amock开始监听` )
    } )
}

init()