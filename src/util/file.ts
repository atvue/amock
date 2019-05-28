import fs, { Stats } from "fs"

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