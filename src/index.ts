import Koa from "koa"

console.log( process.cwd() )

const app = new Koa()

app.use( async ctx => {
    ctx.body = "Hello World"
} )

app.listen( 3000 )
