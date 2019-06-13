import Koa from "koa"
import http from "http"
import { initGetCacheAndWatchDir } from "./store/setup"
import { getConfig } from "./config"
import mapMockApi from "./middleware/map-mock-api"
import setServerHeader from "./middleware/set-server-header"
import checkIfNeedProxy from "./middleware/check-if-need-proxy"
import cacheControl from "./middleware/cache-control"
import KoaBody from "koa-body"
import KoaStatic from "koa-static"
import paths from "./paths"
import path from "path"
import createUploadDir from "./util/create-upload-dir"
import chalk from "chalk"

const { amockRoot , uploadDir } = paths

const server = async () => {
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
    app.use( cacheControl() )
    app.use( mapMockApi() )
    app.use( KoaStatic( publicPath ) )

    app.on( "error" , ( err , ctx ) => {
        console.warn( chalk.red (
            "Amock Server Error" , err
        ) )
    } )

    const localUrl = `http://localhost:${port}` ,
        callback = app.callback() ,
        middleware = await checkIfNeedProxy( callback )

    const server = http.createServer( middleware )
    server.listen( port , () => {
        console.log(
            chalk.green( `Amock启动成功，请访问：${ localUrl }` )
        )
    } )
}


export default server