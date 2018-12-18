import WxService from './assets/plugins/wx-service/WxService'
import Api from './utils/api'
var WXBizDataCrypt = require('utils/RdWXBizDataCrypt.js')

//app.js
App({
  globalData: {
    // url_base:'http://10.1.0.23:8084/uranus/', //烟火的
    // url_base:'http://10.1.0.19:8055/uranus/',    //小沐的
    //url_base:'http://10.1.2.113:8082/uranus/',  //测试服务器
      url_base:'https://jiangshidi.top/',
    //  url_base :'http://10.1.1.74:8056/uranus/',//花生的
    // url_base: 'http://10.1.0.112:80/uranus/',// 新的测试服务器

  
    //正式环境 小程序使用(去服务端取app_token用)
    app_id: 'wxf2da843fe3bd9967',
    private_key: '91bead3947b232ce322001db13884710',
    userInfo: {},
    Apptoken: '', //用户信息
    memberLevel:'',   // 
    mLevel:'',
    wxcode: '', //全局微信code码
    num: 1,//商品数量
    goods_price: "",//商品详情价格传参
    order_price: "",//确认订单价格传参
    order_model: "",//确认订单规格传参
    order_type: "",//确认订单规格传参
    repertory: "",//确认订单规格传参
    currentType:'',
    status:'',              //订单列表传参
    hasLogin: false,        //判断是否需要登录 
    city: '',//城市
    //地址信息
    locationInfo: {
      // latitude: "40.05",
      // longitude: "116.30",
      // speed: "-1",
      // accuracy: "65",
      // altitude: "0",
      // verticalAccuracy: "65",
      // horizontalAccuracy: "65",
      // errMsg: "ok",
    },

    //百度地图 开放平台 访问应用（AK）
    ak: 'SPcBjjHltFOmYFG4gGz9OTTnDFPqXGIx', //正式环境用
    parentUserHasMark:""
  },

  onLaunch: function (options) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log(options)
    //存储用户信息
    
    /* 判断本地缓存有没有Apptoken,如果有，则存入全局变量 */
    try {
      var Apptoken = wx.getStorageSync('Apptoken')
      var memberLevel = wx.getStorageSync('memberLevel')
      var parentUserHasMark = wx.getStorageSync('parentUserHasMark')
      console.log("-----------本地缓存的数据 Apptoken和memberLevel----------------")
      console.log(Apptoken)
      console.log(memberLevel)
      if (Apptoken) {
        this.globalData.Apptoken = Apptoken
        this.globalData.hasLogin = true
        this.globalData.memberLevel = memberLevel                 //全局的判断会员被赋值  0：非会员  1：会员
        this.globalData.parentUserHasMark = parentUserHasMark //全局是否含有邀请人
      }

      var userInfo = wx.getStorageSync('userInfo')
      console.log("-----------本地缓存的数据 userInfo----------------")
      console.log(userInfo)
      console.log(this.globalData.hasLogin)
  
    } catch (e) {
     
    }

    // 调取微信用户信息
   this.getUserInfo()
    // this.getLocation()
  },

  //获取微信用户信息
  getUserInfo() {
    var that = this
    wx.login({
      success: function (res) {
        if(res.code){
          console.log(res.code);
          that.globalData.wxcode = res.code
        }
       
        //获取微信用户信息
        var self = that
        wx.getUserInfo({
          success: function (res) {
            console.log("---------- wx.login  success --------")
            console.log(res.userInfo)

            //放置全局变量
         
            self.globalData.userInfo = res.userInfo

            //将数据存储在本地缓存中
            try {
              wx.setStorageSync('userInfo', res.userInfo)
            } catch (e) {
              
              console.log(e)
            }
          },
          fail: function (res) {
            self.globalData.userInfo = null;
            try {
              wx.setStorageSync('userInfo', null)
            } catch (e) {
              console.log(e)
            }
          }
        })
      },
      fail: function (res) {
        this.globalData.userInfo = null;
        try {
          wx.setStorageSync('userInfo', null)
        } catch (e) {
          console.log(e)
        }
      }
    })
  },
  
  getLocation: function (e) {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log("-----" + JSON.stringify(res))
        that.globalData.locationInfo = res

        const data = {
          ak: that.globalData.ak,
          location: res.latitude + "," + res.longitude,
          output: 'json',
          coordtype: 'wgs84'
        }
        var self = that
        Api.getAddressByLocation({
          data,
          success: (res) => {
            console.log("---------- 取得地理信息 ----------")
            console.log(res.data)
            if (res.data.status != '220') {
              self.globalData.city = res.data.result.addressComponent.city 
            }
            //将数据存储在本地缓存中
            try {
              wx.setStorageSync('city', res.data.result.addressComponent.city)              
            } catch (e) {
              console.log(e)
            }
            console.log(self.globalData.city)
          }
        })

      }
    })
  },

//拿到手机号
  WxService: new WxService
})