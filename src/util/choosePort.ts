import detect from "detect-port-alt"
import chalk from "chalk"
import isRoot from "is-root"
import getProcessForPort from "./getProcessForPort"
import inquirer , { Questions } from "inquirer"

const isInteractive = true // process.stdout.isTTY

function clearConsole() {
    process.stdout.write(
      process.platform === "win32" ? `\x1B[2J\x1B[0f` : `\x1B[2J\x1B[3J\x1B[H`
    )
}


function choosePort( host: string , defaultPort: number|string ): Promise<undefined|number> {
    return detect(defaultPort, host).then(
        ( port: number ) =>
            new Promise(resolve => {
                if ( port === defaultPort ) {
                    return resolve( port )
                }
                const message =
                    process.platform !== "win32" && defaultPort < 1024 && !isRoot()
                    ? `Admin permissions are required to run a server on a port below 1024.`
                    : `Something is already running on port ${defaultPort}.`;
                if (isInteractive) {
                    clearConsole()
                    const existingProcess = getProcessForPort(defaultPort);
                    const question: Questions = {
                        type: "confirm",
                        name: "shouldChangePort",
                        message:
                            chalk.yellow(
                            message +
                                `${existingProcess ? ` Probably:\n  ${existingProcess}` : "" }`
                            ) + `\n\nWould you like to run the app on another port instead?`,
                        default: true,
                    }
                    inquirer.prompt( question ).then( ( answer: any ) => {
                        if ( answer.shouldChangePort ) {
                            resolve(port)
                        } else {
                            resolve( undefined )
                        }
                    } )
                } else {
                    console.log(chalk.red(message))
                    resolve( undefined )
                }
            }
        ) ,
        ( err: any ) => {
            throw new Error(
            chalk.red(`Could not find an open port at ${chalk.bold(host)}.`) +
                "\n" +
                ( `Network error message: ` + err.message || err ) +
                "\n"
            );
        }
    )
}

export default choosePort