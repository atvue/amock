import { Context } from "koa"
import findModuleIdWithRequestKey from "./find-moduleid-with-requestkey"

const json = "application/json" ,
    image = "image/*" ,
    html = "text/html" ,
    text = "text/plain" ,
    supportedAccept = [ json , html , text , image ]


export default async function transfer2Accept( ctx: Context , value: any ) {
    const accept = ctx.accepts( supportedAccept )

    switch ( accept ) {
        case json:
            ctx.type = accept
            ctx.body = ( value as object )
            break
        case text:
        case html:
            ctx.type = accept
            ctx.body = typeof value === "object" ? JSON.stringify( value ) : String( value )
            break
        case image: {
            const key = `${ctx.method} ${ctx.path}` ,
                moduleId = await findModuleIdWithRequestKey( key )
            // console.log( moduleId )
            break
        }
        case false:
            ctx.throw( 406 , `Amock，仅支持${supportedAccept.join(",")}` )
            break
    }
}