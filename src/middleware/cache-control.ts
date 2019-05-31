import { Context } from "koa"


export default () => {
    return async function cacheControl( ctx: Context , next: Function ) {
        ctx.set( "Cache-Control" , "no-cache,no-store,must-revalidate" ) // ,max-age=0
        await next()
    }
}