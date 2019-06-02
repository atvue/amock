import { Context } from "koa"
import path from "path"
import fs from "fs"
import checkRequestImg from "./checkRequestImg"

const json = "application/json" ,
    image = "image/*" ,
    html = "text/html" ,
    text = "text/plain" ,
    supportedAccept = [ json , html , text , image ]


export default async function transfer2Accept( ctx: Context , value: any ): Promise<void> {
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
            const [ hasImgFile , imagePath ] = await checkRequestImg( ctx , value )
            if ( hasImgFile ) {
                const ext = path.extname( imagePath as string )
                ctx.type = ext
                ctx.body = fs.createReadStream( imagePath as string )
                return
            }
            ctx.type = text
            ctx.status = 404
            ctx.body = "Not Found. Please define the api in the mock directory"
            break
        }
        case false:
            ctx.throw( 406 , `Amock，仅支持${supportedAccept.join(",")}` )
            break
    }
}