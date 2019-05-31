import { FileDefaultExportType , getStore } from "./index"
import { isPlainObject } from "lodash"

export let cache: FileDefaultExportType = {}


export const refreshCache = async () => {
    const obj = await getStore()
    cache = obj
}

export const updateCache = ( mockItem: FileDefaultExportType ) => {
    const isObj = isPlainObject( mockItem )
    if ( isObj ) {
        Object.assign( cache , mockItem )
    }
}

export const delKeyCache = ( delKeys?: string[] ): void => {
    if ( delKeys !== undefined && delKeys.length > 0 ) {
        for ( const key of delKeys ) {
            delete cache[ key ]
        }
    }
}

export const delSomeCache = ( mockItem: FileDefaultExportType ) => {
    const isObj = isPlainObject( mockItem )
    if ( isObj ) {
        const keys = Object.keys( mockItem )
        delKeyCache( keys )
    }
}

export const clearCache = () => {
    cache = {}
}
