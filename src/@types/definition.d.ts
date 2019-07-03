declare module "madge" {
    const madge: ( filePath: string | object | Array<string> , obj: object ) => Promise<ResultMadge>
    interface ResultMadge {
        obj: () => ( { [key: string]: [] } )
    }
    export default madge
}