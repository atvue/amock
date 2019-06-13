
### Mock，API配置介绍

假设当前`/mock/index.js`，mock文件有如下结构：

```javascript
const path = require( "path" )
const fs = require( "fs" )
// mock下载文件的包装器
const { download } = require( "amock" )


module.exports = {
    // 直接返回文本
    'GET /string': "123221" ,
    // undefined或者null都以文本返回
    'GET /undefined': undefined ,
    // mock下载文件
    'GET /download': download( "./download2.docx" ) ,
    // 直接返回json
    'GET /abc': { value: "ab2c2" } ,
    'GET /api/project/notice': [1,2,3] ,
    'GET /api/activities': null ,
    // 支持自定义响应内容，提供请求和响应对象
    'GET /api/forms': async (req, res) => {
        await new Promise( r => setTimeout( r , 3000 ) )
        res.body = { message: 'Ok' }
    } ,
    // 支持上传，支持进度条
    'POST /upload': { success: 'post success2' } ,
    // 支持图片查看
    'GET /image/a.jpg': './images/a.jpg' ,
    // 支持自定义响应
    'GET /image/a.jpg': function( request , response ){
        const fpath = path.resolve( __dirname , "./images" , "a.jpg" ) ,
            extname = path.extname( fpath )
        response.type = extname
        response.body = fs.createReadStream( fpath )
    } ,
}
```



