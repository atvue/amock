import { FileDefaultExportType } from "../store/index"
import { isPlainObject , difference } from "lodash"

export default ( nextObj: FileDefaultExportType , prevObj: FileDefaultExportType ): string[] => {
    const isPrevObj = isPlainObject( prevObj ) ,
        isNextObj = isPlainObject( nextObj ) ,
        prevKeys = isPrevObj ? Object.keys( prevObj ) : [] ,
        nextKeys = isNextObj ? Object.keys( nextObj ) : [] ,
        diffKeys = difference( prevKeys , nextKeys )
    return diffKeys
}