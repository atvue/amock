

export default ( module: string ): any => {
    const moduleId: string = require.resolve( module )
    delete require.cache[ moduleId ]
    return require( module )
}