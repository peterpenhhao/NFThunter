import axios from 'axios';

//const service = axios.create({
//    // process.env.NODE_ENV === 'development' 来判断是否开发环境
//    // easy-mock服务挂了，暂时不使用了
//    baseURL: process.env.NODE_ENV == "development" ? "https://localhost:44370/" :"http://www.quxueedu.cn:8081/api",
//    timeout: 10000
//});

export default function adminRequest(config) {
   // console.log(config);
    var defer = new Promise(function (resolve, reject) {
       // console.log('请求数据：', config.data);
        //console.log("process.env.NODE_ENV:" + process.env.NODE_ENV);
        //发送配置
        var requestConfig = {
            method: config.method ? config.method : "post",
            url: config.url,
            data: config.data ? config.data : null,
            baseURL: process.env.NODE_ENV == "development" ? "http://localhost:57968/" : "http://115.29.171.9:6688/",
            withCredentials: false,
            timeout: 300000,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        }
        if (localStorage.getItem('changfei-admin-token')) {
            requestConfig.headers['authentication'] = localStorage.getItem('changfei-admin-token');
        }
        //send Ajax
        axios(requestConfig).then(function (res) {
           // console.log('响应数据：', res.data);
            if (res.data.code === 101) {
                localStorage.setItem('changfei-admin-token', "")
                window.location.hash = '#/login';
            } else if (res.data.code === 102) {
              //  reject("您没有进行此操作的权限");
            }

            resolve(res.data);
        }, function (err) {
            console.log(err);
            reject(err);
        }).catch(function (err) {
            console.log(err);
            reject(err);
        });
    })
    return defer;
}
