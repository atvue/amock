import { Context } from "koa"
import { cache } from "../store/db"
import transfer2Accept from "../util/transfer2accept"


export default () => {
    return async ( ctx: Context, next: Function ) => {
        const { path , method , request , response } = ctx ,
            key = `${ method } ${ path }` ,
            value = cache[ key ] ,
            hasValue = value !== undefined
        if ( hasValue ) {
            const type = typeof value
            switch ( type ) {
                case "object":
                    await transfer2Accept( ctx , value )
                    break
                case "function":
                    await ( value as Function )( request , response )
                    break
            }
            return
        }
        await next()
    }
}