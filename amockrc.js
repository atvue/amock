

module.exports = {
    "port": 8002 ,
    "baseUrl": "." ,
    "paths": [ "./mock" , "/Users/maotingfeng/github/amock/mock2" ] ,
    "proxy": [
        [
            `/s` ,
        ] , {
                target: "http://www.baidu.com" ,
                changeOrigin: true ,
                ws: true ,
                onProxyReq( proxyReq , req , res ) {
                    const { proxyCookie } = process.env
                    if ( proxyCookie ) {
                        proxyReq.setHeader( `Cookie` , proxyCookie )
                    }
                } ,
            }
    ] ,
}