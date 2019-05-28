import fs, { Stats } from "fs"
import klaw from "klaw"
import path from "path"

interface FileCheckFunc {
    ( filePath: string ): Promise<void>
}

export const fileExist: FileCheckFunc = async ( filePath: string ) => {
    return new Promise( ( r , j ) => {
        fs.access( filePath , fs.constants.R_OK | fs.constants.W_OK , err => {
            if ( err ) {
                j( err )
            } else {
                r()
            }
        } )
    } )
}

interface FileStatFunc {
    ( filePath: string ): Promise<Stats>
}
export const stat: FileStatFunc = async( filePath: string ) => {
    return new Promise( ( r , j ) => {
        fs.stat( filePath , ( err , stats: Stats ) => {
            if ( err ) {
                j( err )
            } else {
                r( stats )
            }
        } )
    } )
}

export const isValidModuleFile: ( s: string ) => boolean = ( filePath: string ) => {
    const extname = path.extname( filePath ) ,
        isJavaScriptFile = extname === `.js`
    return isJavaScriptFile
}

interface Walker {
    ( dir: string ): Promise<string[]>
}
export const walker: Walker = ( dir: string ) => {
    return new Promise( ( r , j ) => {
        const items: string[] = []
        klaw( dir )
            .on( "data" , ( item: any ) => {
                const { path: filePath } = item ,
                    isValid = isValidModuleFile( filePath )
                if ( !item.stats.isDirectory() && isValid ) {
                    items.push( filePath )
                }
            } )
            .on( "end" , () => {
                r( items )
            } )
            .on( "error" , ( err: Error , item: any ) => {
                err.message = `${err.message},path:${item.path}`
                j( err )
            } )
    } )
}