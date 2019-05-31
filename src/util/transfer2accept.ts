import { Context } from "koa"

const html = "html" ,
    json = "json" ,
    image = "image" ,
    text = "text" ,
    supportedAccept = [ json , html , text , image ]


export default async function transfer2Accept( ctx: Context , value: any ) {
    const accept = ctx.accepts( ...supportedAccept )
    switch ( accept ) {
        case json:
            ctx.type = accept
            ctx.body = value
            break
        case text:
        case html:
            ctx.type = accept
            ctx.body = typeof value === "object" ? JSON.stringify( value ) : String( value )
            break
        case false:
            ctx.throw( 406 , `Amock，暂支持${supportedAccept.join(",")}only` )
            break
    }
}