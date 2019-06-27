
### `amock.js`配置项目说明

项目目录下新增`amockrc.js`配置文件


### 完整配置项如下：
```javascript
module.exports = {
    // Amock服务的端口，默认 8002
    "port": 8002 ,
    // mock数据的根目录，默认当前目录，'.'
    "baseUrl": "." ,
    // mock文件夹，根据baseUrl查找，可绝对路径。默认 [ './mock' ]
    "paths": [ "./mock" , "/Users/xxx/desktop/mock2" ] ,
    // 代理配置，基于http-proxy-middle。访问：http://localhost:8002/s?wd=a，只有/s开头的请求会被转发，默认 undefined
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