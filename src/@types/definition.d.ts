declare module "madge" {

    const madge: ( filePath: string | object | Array<string> , obj: object ) => Promise<ResultMadge>

    interface ResultMadge {
        obj: () => ( { [key: string]: [] } )
    }
    export default madge
}


declare module "detect-port-alt" {
    const detect: ( port: number | string , host: string ) => Promise<number>
    export default detect
}