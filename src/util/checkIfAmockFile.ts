import requireUncached from "./require-uncached"
import { isPlainObject } from "lodash"
import { ifStartWithRestfulMethod } from "./resultful"

// 判断是否满足Amock的RESTFUL API条件
export const checkIfAmockFile = ( filePath: string ): Boolean => {
    try {
        const defaultExports = requireUncached( filePath ) ,
            ifObject = isPlainObject( defaultExports )
        if ( ifObject ) {
            const keys = Object.keys( defaultExports ) ,
                someHasRestfulMethod = keys.some( ifStartWithRestfulMethod )
            return someHasRestfulMethod
        } else {
            return false
        }
    } catch ( e ) {
        console.warn( e )
        return false
    }
}