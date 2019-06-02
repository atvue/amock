import { MockModule , getStore , MockValueObj } from "./index"

export let cache: MockModule[] = []

export function findApiFromCache( requestMethodPath?: string ): any  {
    const apiList = findAllApis()
    if ( requestMethodPath === undefined ) {
        return undefined
    }
    for ( const obj of apiList ) {
        const hasOwnKey = obj.hasOwnProperty( requestMethodPath )
        if ( hasOwnKey ) {
            return obj[ requestMethodPath ]
        }
    }
}


function findTargetModule( path?: string ): MockModule | undefined {
    const targetModule = cache.find( ( { moduleId } ) => moduleId === path )
    return targetModule
}

function findAllApis(): MockValueObj[] {
    return cache
        .map( ( { api } ) => api )
        .filter( item => item !== undefined ) as MockValueObj[]
}

export const refreshCache: () => void = async () => {
    const obj: MockModule[] = await getStore()
    cache = obj
}

export const updateCache = ( path: string , mockItem?: MockValueObj ) => {
    const targetModule = findTargetModule( path )
    if ( targetModule ) {
        targetModule.api = mockItem
    } else {
        const newMock: MockModule = {
            moduleId: path ,
            api: mockItem
        }
        cache.push( newMock )
    }
}

export const delKeyCache = ( path: string , delKeys?: string[] ): void => {
    const target = findTargetModule( path )
    if ( delKeys !== undefined && delKeys.length > 0 ) {
        if ( target && target.api ) {
            for ( const key of delKeys ) {
                delete target.api[ key ]
            }
        }
    }
}

export const delCache = ( filePath?: string ) => {
    const index = cache.findIndex( ( { moduleId } ) => filePath === moduleId )
    if ( index !== -1 ) {
        cache.splice( index , 1 )
    }
}

export const clearCache = () => {
    cache = []
}
