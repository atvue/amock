import { Context } from "koa"
import path from "path"
import fs from "fs"
import checkRequestFile from "./checkRequestFile"
import { downloadSymbol } from "./download"

const json = "application/json" ,
    image = "image/*" ,
    html = "text/html" ,
    text = "text/plain" ,
    anyMimeType = "*/*" ,
    supportedAccept = [ json , html , text , image ]


export default async function transfer2Accept( ctx: Context , value: any ): Promise<void> {
    const accepts = ctx.accepts() ,
        priorityJson = Array.isArray( accepts ) && accepts.length === 1 && accepts.includes( anyMimeType )
    let accept: string | boolean | symbol = ctx.accepts( supportedAccept )
    // 当没有指定accept或者accept为任意类型时，优先json返回
    if ( priorityJson ) {
        accept = json
    }
    // 检测是否需要下载
    if ( value && value.type === downloadSymbol ) {
        accept = downloadSymbol
    }
    // console.log( priorityJson , accepts , accept )
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
        case downloadSymbol:
        case image: {
            const [ hasFile , filePath ] = await checkRequestFile( ctx , value )
            if ( hasFile ) {
                const ext = path.extname( filePath as string )
                ctx.type = ext
                ctx.body = fs.createReadStream( filePath as string )
                if ( accept === downloadSymbol ) {
                    const { options } = value ,
                        { base } = path.parse( filePath as string ) ,
                        filename = ( options && options.filename ) || base
                    ctx.attachment( filename )
                }
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