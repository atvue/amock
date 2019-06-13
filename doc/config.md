
### `amock.js`配置项目说明

```javascript
module.exports = {
    // Amock服务的端口
    "port": 8002 ,
    // mock数据的根目录，默认当前目录
    "baseUrl": "." ,
    // mock文件夹，根据baseUrl查找，可绝对路劲
    "paths": [ "./mock" , "/Users/maotingfeng/github/amock/mock2" ] ,
    // 代理配置，基于http-proxy-middle
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
```