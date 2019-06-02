import server from "./server"
import chalk from "chalk"

export { default as download } from "./util/download"

server().catch( error => {
    console.warn(
        chalk.red( error )
    )
} )