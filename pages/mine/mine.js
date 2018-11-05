//index.js
//获取应用实例
const app = getApp()
const api = require('../../utils/api.js')
Page({
  data: {
    userInfo: {},
    phone: "",
    mLevel:'',
    hasLogin:false,
    isAuth:false,     //是否微信头像授权
    tabs: [
      {
        name: "待付款",
        imgUrl: "../../image/nopay.png"
      },
      {
        name: "待收货",
        imgUrl: "../../image/ready.png"
      },
      {
        name: "已完成",
        imgUrl: "../../image/finish.png"
      },
      {
        name: "已取消",
        imgUrl: "../../image/quxiao.png"
      },
    ],
    simpleNum:'',
    smallNum:'',
    bigNum:'',
  },

  goAll:function(){
    if (app.globalData.hasLogin == false) {
      wx.navigateTo({
        url:'/pages/login/login'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/mine/order-list/order-list?navid=0',
    })
  },
  onLoad: function () {
    // 判断用户有没有授权
   
  },

  onShow: function () {
    console.log(app.globalData.userInfo)
    var that = this;
    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']) {
          console.log('已经授权')
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              app.globalData.userInfo = res.userInfo;
              that.setData({
                isAuth:true,
                userInfo: app.globalData.userInfo,
              })
            }
          })
        }
      }
    })  
    that.showInfo();
    that.getMemberLevel();
    that.getFanNum()
  },

  showInfo:function(){
    var that = this;
    if (app.globalData.hasLogin == false) {
      that.setData({
        phone:'',
        userInfo:'',
        hasLogin:false
      })
      wx.showModal({
        title: '温馨提示',
        content: '您还没有登录，是否要登录？',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login?prevPage=' + 'mine',
            })
          }
        }
      })
    } else {
      that.setData({
        hasLogin: app.globalData.hasLogin,  
      })   
  
      if (app.globalData.userInfo) {    //如果登录了并且微信授权了获取微信头像
        that.setData({
          userInfo: app.globalData.userInfo,
        })     
      }
      that.getphone()   //调用获取手机号
    }
  },

  bindGetUserInfo:function(e){    //调起获取用户信息授权
    console.log(e.detail.userInfo)
    if (e.detail.userInfo){
      //用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: app.globalData.userInfo,
        isAuth:true,
      })
    } else {
      //用户按了拒绝按钮
      console.log('用户拒绝授权')
      app.globalData.userInfo == null
    }
  },

  toMyFans:function(){
    wx.navigateTo({
      url:'/pages/mine/fans/fans?type=1'
    })
  },

  partner:function(){
    wx.navigateTo({
      url:'/pages/mine/partner/partner'
    })
  },
  //跳转基本信息页
  basicinfo: function () {
    var url = '/pages/mine/basicmsg/basicmsg?phone=' + this.data.phone
    wx.navigateTo({
      url: url
    });
  },

  goLogin:function(){
    wx.navigateTo({
      url:'/pages/login/login'
    })
  },
  //跳转付款码
  toQRcode: function () {
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000
    })
  },

  orderArea:function(){
    if (app.globalData.hasLogin == false) {
      wx.navigateTo({
        url:'/pages/login/login'
      })
      return false;
    }
    wx.navigateTo({
      url:'/pages/mine/orderArea/orderArea'
    })
  },

  //联系客服
  tellService : function(){
    wx.showModal({
      title: '提示',
      content: '400-0000-0000',
      showCancel:false
    })
  },

   //跳转帮助中心
   tohelp : function(){
    wx.navigateTo({
      url: '/pages/mine/ser-center/help-center/help-center',
    })
   },
  //跳转服务中心页
  sercenter: function () {
    var url = '/pages/mine/ser-center/ser-center'
    wx.navigateTo({
      url: url
    });
  },

  // 跳转我的钱包页面
  towallet: function () {
    if (app.globalData.hasLogin == false) {
      wx.navigateTo({
        url:'/pages/login/login'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/mine/wallet/wallet',
    })
  },

  toinvite: function () {
    if (app.globalData.hasLogin == false) {
      wx.navigateTo({
        url:'/pages/login/login'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/mine/invite/invite',
    })
  },

  goCollect:function(){
    wx.navigateTo({
      url: '/pages/mine/collect/collect',
    })
  },

  //跳转我的订单页面
  toorderList: function (e) {
    console.log(app.globalData.hasLogin)
    if (app.globalData.hasLogin == false) {
      wx.navigateTo({
        url:'/pages/login/login'
      })
      return false;
    }
    const navid = e.currentTarget.dataset.index
    console.log(navid)
    var url = '/pages/mine/order-list/order-list?navid=' + navid
    wx.navigateTo({
      url: url
    });
  },

  //优惠券 门店  消息没开放
  no: function () {
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000
    })
  },
  // 进入消息页面
  goNews:function(){
    wx.navigateTo({
      url:'/pages/mine/news/news'
    })
  },
  //获取手机号
  getphone:function() {
    let data = {
      method: 'inviteFriends',
      token: app.globalData.Apptoken,
      url_type: 'myself'
    }
    api.reqData({
      data,
      success: (res) => {
        if (res.data.success==1){
          console.log(res.data)
          this.setData({
            phone: res.data.result.rs[0].inviteCode[0].InvitationCode
          })
        }else if(res.data.success == 2){
          app.globalData.hasLogin = false;
          console.log(app.globalData.hasLogin)
        }else{
          console.log('获取手机号错误')
        }        
      },
    })
  },
  //复制邀请码
  copy:function(){
    wx.setClipboardData({
      data: this.data.phone,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  // 获得粉丝的数量
  getFanNum:function(){
    let that = this;
    let data = {
      method: 'getLevelCount',
      token: app.globalData.Apptoken,
      url_type: 'myself'
    }
    api.reqData({
      data,
      success: (res) => {
        let result = res.data.result.rs[0].result.result.rs[0];
        that.setData({
          simpleNum:result.levelA,
          smallNum:result.levelB,
          bigNum:result.levelC
        })
      },
    })
  },

  // 进入粉丝详情页
  fanDetail:function(e){
    let index = e.currentTarget.dataset.id;
    console.log(index)
    wx.navigateTo({
      url:'/pages/mine/fans/fans?type='+index
    })
  },
  // 点击普通会员跳转到等级页面
  goLevel:function(){
    wx.navigateTo({
      url:'/pages/mine/memberLevel/memberLevel'
    })
  },

  logout() {
    app.WxService.showModal({
      title: '友情提示',
      content: '确定要退出登录吗？',
    })
      .then(data => data.confirm == 1 && this.signOut())
  },

  signOut:function(){
    //清空页面数据
    this.setData({
      hasLogin: false,
      userInfo: "",
    })
    
    wx.removeStorageSync('Apptoken')
    wx.removeStorageSync('memberLevel')
    wx.removeStorageSync('hasLogin') 
    wx.removeStorageSync('parentUserHasMark') 
    //清除相关全局变量和缓存
    app.globalData.hasLogin = false,
    app.globalData.memberLevel = ""
    app.globalData.Apptoken = ""
    app.globalData.parentUserHasMark = ""
    wx.switchTab({
      url: '../index/index'
    })
  },

  // 跳转到设置页面
  install:function(){
    wx.navigateTo({
      url:'/pages/mine/install/install'
    })
  },

  // 获得当前用户的等级
  getMemberLevel:function(){
    let that = this;
    let data = {
      method:'getMemberLevel',
      token:app.globalData.Apptoken,
      url_type:'myself',
    }
    api.reqData({
      data,
      success:function(res){
        app.globalData.mLevel = res.data.result.rs[0].result.result.rs[0].member_level
        that.setData({
          mLevel:res.data.result.rs[0].result.result.rs[0].member_level
        })
      }
    })
  }
})
