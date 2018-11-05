// pages/member/tqcash/tqcash.js
const api = require('../../../utils/api.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: "",   //从会员页面带过来的可提现
    money: "",     //用户要提现的金额
    canPrompt:true,   //点击提现的按钮
    autoColor:'#b3b3b3',
    autoBack:'#ebebeb',
    isAuth:false,   //是否授权头像昵称
    userInfo:{},
    moreWarn:false,   //   
    showModal:'none',   //二次确认提现的框
    isPrompt:true,   //输入提现金额的input是否可用
    showSmsCode:'none',   //短信验证码框的显示
    isFocus:false,
    Length:6,    //验证码输入框的个数
    Value:'',      //输入框得值
    phone:'',    //用户手机号转换为****
    tel:'',    //用户完整手机号
    finishText:'',
    js_code:'',
    countDown:300,  //倒计时
    isSendCode:false,    //是否发送验证码
    isCanSub:false,
    isSureSub:false
  },

  toPrompt:function(){
    this.setData({
      showModal:'block'
    })
  },

  allBalance: function () {   //点击全部提现
    this.setData({
      money: parseInt((this.data.balance/100).toFixed(2))
    })
    if(this.data.money != '0.00'){
      this.setData({
        canPrompt:false,
        autoBack:'#b61c25',
        autoColor:'#fff'
      })
    }else if(this.data.money == 0.00 || this.data.money == 'undefined'){
      this.setData({
        money:'',
        autoColor:'#b3b3b3',
        autoBack:'#ebebeb',
      })
    }
  },

  secondSure:function(){
    // this.setData({
    //   showModal:'none',
    //   showSmsCode:'block'
    // })
    //调用获取验证码接口
    let that = this; 
    console.log(that.data.tel)
    that.setData({
      isSureSub:true
    })
    let data = {
      method: "getVerificationCodeOptimize",
      phone: that.data.tel,
      url_type: 'user'
    }
    console.log(data)
    api.reqData({
      data,
      success: (res) => {
        console.log(res.data)
        if (res.data.success == 1) {
          that.setData({
            showModal:'none',
            showSmsCode:'block',
            isSureSub:false
          })
          var count = that.data.countDown;
          console.log(count)
          var si = setInterval(function () {
            if (count > 0) {
              count--;
              that.setData({
                countDown: count,
                isSendCode:true
                
              });
              console.log(count)
            } else {
              that.setData({
                isSendCode:false
              });
              count = 300;
              clearInterval(si);
            }
          }, 1000);
        } else {
          wx.showToast({
            title: res.data.errorMessage,
            icon: 'none'
          })
          that.setData({
            isSureSub:false
          })
        }
      },

    })
  },
  

  finishSub:function(){      //最后提交的提现
    var that = this;
    let smsCode = that.data.Value.split('');
    console.log(smsCode)
    if(smsCode.Length == 0){
      wx.showToast({
        title:'验证码为空',
        icon:'none'
      })
      return ;
    }else if(smsCode.length < 6){
      wx.showToast({
        title:'验证码不正确',
        icon:'none'
      })
      return ;
    }
    that.setData({
      isCanSub:true,
    })
    wx.login({
      success: function (res) {
        console.log(res.code)
        if (res.code) {     
          let data = {
            method: 'reviewWithdraw',
            token: app.globalData.Apptoken,
            amount:that.data.money,
            jsCode: res.code,
            phone:that.data.tel,
            smsCode:that.data.Value,
            url_type: 'member'
          }
          console.log(data)
          api.reqData({
            data,
            success: function(res) {
              console.log('返回的提现情况')
              console.log(res.data)
              if(res.data.success == 1){
                wx.showToast({
                  title:'提现成功，预计48小时内到账',
                  icon:'none'
                })
                setTimeout(function(){
                  wx.navigateBack();
                },2000);
              }else{
                wx.showToast({
                  title:res.data.errorMessage,
                  icon:'none'
                })
                that.setData({
                  Value:'',
                  isCanSub:false,
                })
              }
            }  
          })
        }
      }
    })  
  },

   //获取手机号
  getphone:function() {
    let that = this;
    let data = {
      method: 'inviteFriends',
      token: app.globalData.Apptoken,
      url_type: 'myself'
    }
    api.reqData({
      data,
      success: (res) => {
        if (res.data.success==1){
          let tel = res.data.result.rs[0].inviteCode[0].InvitationCode;
          that.setData({
            phone: tel.substr(0, 3) + '*****' + tel.substr(8),
            tel:res.data.result.rs[0].inviteCode[0].InvitationCode,
          })
        }else{
          console.log('获取手机号错误')
        }        
      },
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options.balance) 
    that.setData({
      balance: options.balance
    })
    wx.getSetting({     //判断用户是否授权
      success: function(res){
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              that.setData({
                isAuth:true,
                userInfo:res.userInfo,
                isPrompt:false,
                isFocus:true
              })
            }
          })
        }
      }
    })
    that.getphone()
  },

  goPrompt:function(e){    //  填入可提现金额的input离开事件
    if(parseFloat(e.detail.value) > (this.data.balance/100).toFixed(2)){
      this.setData({
        moreWarn:true,
        canPrompt:true,
        autoBack:'#ebebeb',
        autoColor:'#b3b3b3',  
      })
    }else if(e.detail.value == '' || e.detail.value == 0){
      this.setData({
        moreWarn:false,
        canPrompt:true,
        autoBack:'#ebebeb',
        autoColor:'#b3b3b3',
      })
    }else if(parseFloat(e.detail.value) <= (this.data.balance/100).toFixed(2) && parseFloat(e.detail.value) >= 1){
      this.setData({
        moreWarn:false,
        canPrompt:false,
        autoBack:'#b61c25',
        autoColor:'#fff',
        money:e.detail.value
      })
    }
    
  },

  bindGetUserInfo:function(e){    //调起获取用户信息授权
    console.log(e.detail.userInfo)
    if (e.detail.userInfo){
      //用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        isAuth:true,
        isPrompt:false
      })
    } else {
      //用户按了拒绝按钮
      console.log('用户拒绝授权')
      app.globalData.userInfo == null
    }
  },

  noModal:function(){     //提现取消
    this.setData({
      showModal:'none'
    })
  },

  Tap(){ 
    var that = this; 
    that.setData({ 
     isFocus:true, 
    }) 
  }, 

  Focus(e){ 
    var that = this; 
    console.log(e.detail.value); 
    var inputValue = e.detail.value; 
    that.setData({ 
     Value:inputValue, 
    }) 
  }, 

  noSmsBox:function(){
    this.setData({
      showSmsCode:'none',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.isAuth == true){
      userInfo: app.globalData.userInfo
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})