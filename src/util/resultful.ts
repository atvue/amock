import { isString } from "lodash"

enum Methods {
    GET = "GET" ,
    POST = "POST" ,
    PUT = "PUT" ,
    PATCH = "PATCH" ,
    DELETE = "DELETE" ,
}

export const methods = Object.keys( Methods )


export const ifStartWithRestfulMethod = ( maybeUrl: string ): Boolean => {
    return isString( maybeUrl ) ? (
        methods.some( method => maybeUrl.toUpperCase().startsWith( `${method}\u{20}` ) )
    ) : false
}