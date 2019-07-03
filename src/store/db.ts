import { MockModule , getStore , MockValueObj } from "./index"
import path from "path"
import { appDirectory } from "../paths"
import madge from "madge"
import madgeConfig from "../util/madgeConfig"
import { checkIfAmockFile } from "../util/checkIfAmockFile"

export let cache: MockModule[] = []

type checkIfDefineReturnValue = [ boolean , any? ]

export function findApiFromCache( requestMethodPath?: string ): checkIfDefineReturnValue  {
    const apiList = findAllApis()
    if ( requestMethodPath === undefined ) {
        return [ false ]
    }
    for ( const obj of apiList ) {
        const hasOwnKey = obj.hasOwnProperty( requestMethodPath )
        if ( hasOwnKey ) {
            return [ true , obj[ requestMethodPath ] ]
        }
    }
    return [ false ]
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

export const updateCache = async ( filePath: string , mockItem?: MockValueObj ) => {
    const isAmockFile = checkIfAmockFile( filePath )
    if ( isAmockFile ) {
        const targetModule = findTargetModule( filePath ) ,
            deps = ( await madge( filePath , madgeConfig ) ).obj() ,
            filePathSub = path.relative( appDirectory , filePath ) ,
            hasDeps = deps[ filePathSub ] && deps[ filePathSub ].length > 0
        if ( targetModule ) {
            targetModule.api = mockItem
            targetModule.deps = hasDeps ? deps : undefined
        } else {
            const newMock: MockModule = {
                moduleId: filePath ,
                api: mockItem ,
                deps: hasDeps ? deps : undefined ,
            }
            cache.push( newMock )
        }
    } else {
        delCache( filePath )
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

function isApiInTheModule( obj: MockValueObj | undefined , key?: string ): boolean {
    if ( obj !== undefined && key !== undefined ) {
        return obj.hasOwnProperty( key )
    } else {
        return false
    }
}

export const findModuleIdWithRequestKey = ( reqeustKey: string ): string | undefined => {
    for ( const module of cache ) {
        const { moduleId , api } = module ,
            has = isApiInTheModule( api , reqeustKey )
        if ( has ) {
            return moduleId
        }
    }
    return undefined
}

// 获取依赖当前模块的模块
export const getModulesBeDepended = ( filePath: string ): Array<string> => {
    const arr: Array<string> = []
    const subPath = path.relative( appDirectory , filePath )
    for ( const item of cache ) {
        const { moduleId , deps } = item ,
            hasDeps = deps !== undefined ,
            self = moduleId === filePath
        if ( self ) {
            continue
        }
        if ( hasDeps ) {
            const inDeps = ( deps as object ).hasOwnProperty( subPath )
            if ( inDeps ) {
                arr.push( moduleId )
            }
        }
    }
    return arr
}