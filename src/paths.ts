import path from "path"
import fs from "fs"


const appDirectory = fs.realpathSync( process.cwd() ) ,
    amockRoot = path.resolve( __dirname , "../" )

export default {
    appDirectory ,
    amockRoot ,
}