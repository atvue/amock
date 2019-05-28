import Koa from "koa"
import paths from "./paths"
import { getConfig } from "./config"
import { getStore } from "./store"

const app = new Koa()
app.use( async ctx => {
    if ( ctx.url === `/` ) {
        getStore()
    }
    ctx.body = "Hello World"
} )

app.listen( 3000 )
