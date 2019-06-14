import chalk from "chalk"

const appName = `Amock:`

function logProvider() {
    const myCustomProvider = {
        success( ...args: any[] ) {
            console.log(
                chalk.green( appName , ...args )
            )
        } ,
        warn( ...args: any[] ) {
            console.log(
                chalk.yellow( appName , ...args )
            )
        } ,
        error( ...args: any[] ) {
            console.log(
                chalk.red( appName , ...args )
            )
        } ,
    }
    return myCustomProvider
}

const log = logProvider()

export default log