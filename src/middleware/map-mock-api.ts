import { Context } from "koa"
import { findApiFromCache } from "../store/db"
import transfer2Accept from "../util/transfer2accept"


export default () => {
    return async ( ctx: Context, next: Function ) => {
        const { path , method , request , response } = ctx ,
            key = `${ method } ${ path }` ,
            [ hasDefinedApi , value ] = findApiFromCache( key )
        if ( hasDefinedApi ) {
            const type = typeof value
            switch ( type ) {
                case "number":
                case "undefined":
                case "string":
                case "object":
                    await transfer2Accept( ctx , value )
                    break
                case "function":
                    await ( value as Function )( request , response , ctx )
                    break
            }
            return
        }
        await next()
    }
}