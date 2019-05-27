import path from "path"
import fs from "fs"


const appDirectory = fs.realpathSync( process.cwd() )


export default {
    appDirectory ,
}