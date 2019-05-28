import { Mock , getStore } from "./index"

export let cache: Mock = {}


export const refreshCache = async () => {
    const obj = await getStore()
    cache = obj
}

export const updateCache = ( mockItem?: Mock ) => {
    Object.assign( cache , mockItem )
}

export const delSomeCache = ( mockItem?: Mock ) => {
    const keys = Object.keys( mockItem )
    for ( const key of keys ) {
        delete cache[ key ]
    }
}

export const clearCache = () => {
    cache = {}
}
