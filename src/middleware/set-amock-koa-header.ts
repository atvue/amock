import { Context } from "koa"



export default function( Server: string ) {
    return async function setAmockKoaHeader( ctx: Context , next: Function ) {
        ctx.set( "Server" , Server )
        await next()
    }
}