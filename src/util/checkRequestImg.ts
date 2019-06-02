import { Context } from "koa";
import { findModuleIdWithRequestKey } from "../store/db"
import { fileExist } from "./file"
import path from "path"
import constants from "constants"


export default async ( ctx: Context , value: any ): Promise< [ boolean , string? ] > => {
    const { method , path: requestPath } = ctx ,
        key = `${ method } ${ requestPath }` ,
        moduleId = await findModuleIdWithRequestKey( key ) ,
        isString = typeof value === "string"

    if ( moduleId && isString ) {
        const { dir } = path.parse( moduleId ) ,
            imagePath = path.resolve( dir , value )
        try {
            await fileExist( imagePath )
            return [ true , imagePath ]
        } catch ( e ) {
            if ( Math.abs( e.errno ) !== constants.ENOENT ) {
                console.warn( e )
            }
        }
    }
    return [ false ]
}