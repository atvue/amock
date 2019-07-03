import chalk from "chalk"
import child_process from "child_process"
import path from "path"

const execSync = child_process.execSync

const execOptions = {
  encoding: "utf8",
  stdio: [
    "pipe", // stdin (default)
    "pipe", // stdout (default)
    "ignore", // stderr
  ],
};

function isProcessAReactApp( processCommand: string ) {
  return /^node .*react-scripts\/scripts\/start\.js\s?$/.test( processCommand )
}

function getProcessIdOnPort( port: number | string ) {
  return execSync( "lsof -i:" + port + " -P -t -sTCP:LISTEN" , execOptions as any )
    .split("\n")[0]
    .trim()
}

function getPackageNameInDirectory( directory: string ) {
  const packagePath = path.join(directory.trim(), `package.json`)
  try {
    return require(packagePath).name
  } catch ( e ) {
    return undefined
  }
}

function getProcessCommand( processId: string , processDirectory: string ) {
  let command = execSync(
    `ps -o command -p ` + processId + ` | sed -n 2p`,
    execOptions as any
  );

  command = command.replace( /\n$/ , "" )

  if (isProcessAReactApp(command)) {
    const packageName = getPackageNameInDirectory(processDirectory);
    return packageName ? packageName : command;
  } else {
    return command;
  }
}

function getDirectoryOfProcessById( processId: any ) {
  return execSync(
    "lsof -p " +
      processId +
      ` | awk \'$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}\'`,
    execOptions as any
  ).trim();
}

function getProcessForPort( port: number | string ) {
  try {
    const processId = getProcessIdOnPort( port );
    const directory = getDirectoryOfProcessById(processId);
    const command = getProcessCommand(processId, directory);
    return (
        chalk.cyan(command) +
        chalk.grey(" (pid " + processId + ")\n") +
        chalk.blue("  in ") +
        chalk.cyan(directory)
    )
  } catch (e) {
    return undefined
  }
}


export default getProcessForPort
