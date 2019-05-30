import { Context } from "koa"
import { cache } from "../store/db"


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
                    ctx.body = value
                    break
                case "function":
                    await ( value as Function )( request , response )
                    break
            }
        }
        await next()
    }
}