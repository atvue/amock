
export const DownloadSymbol = Symbol( "type for download" )

interface Options {
    filename?: string ,
}

function download( path: string , options?: Options ): String {
    const strObj = new String( path )
    Object.assign( strObj , {
        type: DownloadSymbol ,
        options ,
    } )
    return strObj
}


export default download