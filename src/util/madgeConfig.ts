import path from "path"
import { appDirectory } from "../paths"

export default {
    baseDir: appDirectory ,
    tsConfig: path.resolve( appDirectory , `tsconfig.json` ) ,
}