import Koa from "koa"
import { initGetCacheAndWatchDir } from "./store/setup"
import { getConfig } from "./config"
import mapMockApi from "./middleware/map-mock-api"
import setServerHeader from "./middleware/set-server-header"
import KoaBody from "koa-body"
import KoaStatic from "koa-static"
import paths from "./paths"
import path from "path"
import createUploadDir from "./util/create-upload-dir"

const { amockRoot , uploadDir } = paths

const init = async () => {
    const config = await getConfig()
    await initGetCacheAndWatchDir()
    await createUploadDir()
    const app = new Koa() ,
        { port } = config ,
        publicPath = path.resolve( amockRoot , "public" )

    app.use( setServerHeader( "amock-koa/1.0" ) )
    app.use( KoaBody( {
        multipart: true ,
        formidable: {
            uploadDir ,
        }
    } ) )
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