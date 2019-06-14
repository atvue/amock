
## Amock，一个Mock数据工具

### 功能列表
- API书写友好,基于REST原则
- 支持文件上传接口，文件下载，文件上传支持进度条
- 支持图片mock
- 支持`mock.js`工作流
- 支持代理转发,基于`http-proxy-middleware`
- 支持自定义响应消息
- 支持现有nei mock项目

### 如何使用？

- 安装`yarn add @atvue/amock`
- 项目目录下配置`amockrc.js`配置项
    ```javascript
    // example
    module.exports = {
        "port": 8002 ,
    }
    ```
- 根目录下新建`mock`目录，在其中新建任一js文件，比如`index.js`。内容如下：
    ```javascript
    module.exports = {
        'GET /hello': { "hello": "world!" } ,
    }
    ```
- 在`scripts`定义amock命令
    ```json
    {
        "scripts": {
            "start": "yarn start" ,
            "amock": "amock"
        }
    }
    ```
    启动：`yarn amock`，访问：`http://localhost:8002/hello`


### 配置说明

- [`amock.js`](./doc/config.md)配置说明
- [`mock文件下的API`](./doc/api.md)配置说明