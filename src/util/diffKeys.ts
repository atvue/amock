import { isPlainObject , difference } from "lodash"

export default ( nextObj: any , prevObj: any ): string[] => {
    const isPrevObj = isPlainObject( prevObj ) ,
        isNextObj = isPlainObject( nextObj ) ,
        prevKeys = isPrevObj ? Object.keys( prevObj ) : [] ,
        nextKeys = isNextObj ? Object.keys( nextObj ) : [] ,
        diffKeys = difference( prevKeys , nextKeys )
    return diffKeys
}