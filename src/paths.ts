import path from "path"
import fs from "fs"


const appDirectory = fs.realpathSync( process.cwd() ) ,
    amockRoot = path.resolve( __dirname , "../" ) ,
    uploadDir = path.resolve( __dirname , "../.cache" )

export default {
    appDirectory ,
    amockRoot ,
    uploadDir ,
}