import Koa from "koa"
import { init } from "./store/setup"
import { cache } from "./store/db"

init()

const app = new Koa()
app.use( async ctx => {
    if ( ctx.url === `/` ) {
        console.log( cache )
    }
    ctx.body = "Hello World"
} )

app.listen( 3000 )
