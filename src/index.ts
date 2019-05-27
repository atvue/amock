import Koa from "koa"
import paths from "./paths"


const app = new Koa()


app.use( async ctx => {
    ctx.body = "Hello World"
} )

app.listen( 3000 )
