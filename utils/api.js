const MD5Utils = require('MD5.js');
const util = require('util.js');
const App = getApp();
const wxRequest = (params, url,mark) => {
  if (mark) {
    var value = wx.getStorageSync('Apptoken')
    console.log("-----------本地缓存的数据 Apptoken----------------")
    console.log(value)

    //从缓存里根据key查询登陆信息，如果存在则继续，不存在则跳转登陆页面
    if (value == '') {//
      //拦截需要登陆的请求跳转登陆页面，不需要登陆的请求正常访问(/openapi/goods)
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  }

  wx.request({
    url,
    method: params.method || 'GET',
    data: params.data || {},
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    //收到开发者服务成功返回的回调函数
    success(res) {
      if (params.success) {
        params.success(res);
      }
    },
    //接口调用失败的回调函数
    fail(res) {
      if (params.fail) {
        params.fail(res);
        console.log(res)
      }
    },
    //接口调用结束的回调函数（调用成功、失败都会执行）
    complete(res) {
      if (params.complete) {
        params.complete(res);
      }
    },
  });
};


//--------------libai新小程序测试用例
const reqData = (params) => {
  // console.log("==================================")
  // console.log(params)
   var urlType = params.data.url_type;
   var needLogin = false;//需不需要登陆  

   //路径切换时注意注册和登录验证码图片路径修改一致的问题

    var url_test = 'https://jiangshidi.top/';   //线上服务器

  // var url_test = 'http://10.1.0.9:8056/uranus/'; // 新测试服务器
  // var url_test = 'http://10.1.0.112:80/uranus/'; // 新测试服务器
  // var url_test = 'http://10.1.0.19:8055/uranus/';//小沐


  var urls = '';
  if (urlType == 'order') {
    urls = url_test + "order";
    needLogin = true;//
  } else if (urlType == 'finance') {  //
    urls = url_test + "finance";
   needLogin = true;
  } else if (urlType == 'index') {
    urls = url_test + "index";
    //needLogin = true;
  } else if (urlType == 'user') {
    urls = url_test + "user";
    //needLogin = true;
  } else if (urlType == 'classify') {
    urls = url_test + "classify";
    //needLogin = true;
  }else if (urlType == 'my') {
    urls = url_test + "my";
    needLogin = true;
  }
  else if (urlType == 'myself') {
    urls = url_test + "myself";
    //needLogin = true;
  }
  else if (urlType == 'member') {
    urls = url_test + "member";
    needLogin = true;
  } 
  else if (urlType == 'income') {
    urls = url_test + "income";
     needLogin = true;
   }
  else if (urlType == 'recommen') {
    urls = url_test + "recommen";
  }else if(urlType == 'pdd'){
    urls = url_test + "pdd";
    needLogin = true;
  }
 
  wxRequest(params, urls,needLogin);
};
//根据经纬度获取百度地图上的城市地理信息
const getAddressByLocation = (params) => {
  wxRequest(params, "https://api.map.baidu.com/geocoder/v2/", false);
};

module.exports = {
  reqData,
  getAddressByLocation
};

