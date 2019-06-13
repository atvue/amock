import { IncomingMessage , ServerResponse , RequestListener } from "http"
import url from "url"
import { findModuleIdWithRequestKey } from "../store/db"
import proxy from "http-proxy-middleware"
import chalk from "chalk"
import http from "http"
import { getConfig } from "../config"

type ProxyResFunc = (proxyRes: http.IncomingMessage, req: http.IncomingMessage, res: http.ServerResponse) => void

type ProxyArgs = [ string | string[] | proxy.Filter , proxy.Config ]

const ReservedRequest = [ `GET /` , `GET /favicon.ico` ] ,
    onProxyRes: ProxyResFunc = ( proxyRes , req , res ) => {
        const requestPath = `${ req.method } ${ req.url }` ,
            msg = `proxy to: ${ requestPath } , success`
        console.log( chalk.greenBright( msg ) )
    }


export default async ( callback: RequestListener ): Promise<RequestListener> => {
    const { proxy: proxyArgs } = await getConfig() ,
        hasProxy = proxyArgs !== undefined && proxyArgs.length > 0
    if ( hasProxy ) {
        const proxyOptions = proxyArgs ? proxyArgs[ 1 ] : undefined
        if ( proxyOptions ) {
            const tmpOnProxyRes = proxyOptions.onProxyRes
            proxyOptions.onProxyRes = function( ...args ) {
                if ( tmpOnProxyRes ) {
                    tmpOnProxyRes( ...args )
                }
                onProxyRes( ...args )
            } as ProxyResFunc
        }
        const middleware = proxy( ...( proxyArgs as ProxyArgs ) )
        return function checkIfNeedProxy( req: IncomingMessage, res: ServerResponse ) {
            const path = req.url ? url.parse( req.url ).pathname : undefined ,
                hasPath = path !== undefined
            if ( hasPath ) {
                const requestPath = `${ req.method } ${ path }` ,
                    moduleId: string | undefined = findModuleIdWithRequestKey( requestPath ) ,
                    noDefinedApi = moduleId === undefined ,
                    reserved = ReservedRequest.includes( requestPath ) ,
                    notReserved = !reserved
                if ( noDefinedApi && notReserved ) {
                    return middleware( req , res , () => { throw new Error( `next 需要处理` ) } )
                }
            }
            callback( req , res )
        }
    } else {
        return callback
    }
}