var util = require("../../utils/util.js")
var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js');
const api = require('../../utils/api.js');
const app = getApp();
// pages/login/login.js
Page({
  data: {
    btnLoading: false,
    disabled: false,
    prevPage:'',
    tele:'',
    loginDisabled:true,
    mobile:'',
    pwd:'',
    phone:'',
    loginName:'',             
    showModal: false,  
    finishBtnColor: '#b3b3b3',  //完成按钮的字体颜色
    finishBtnBgColor: '#ebebeb',  //完成按钮的背景
    loginBtnColor:'#ebebeb'
  },


//事件处理函数
formSubmit:function(e){
   var param = e.detail.value;
   this.mysubmit(param); 
},
 
  

mysubmit: function (param) {
  var flag = this.checkPhone(param) && this.checkPassword(param);
  if (flag) {
    this.checkUserInfo(param);
   
  }
 
},
//获取用户输入的用户名
  phoneInput: function (e) {
    if (this.data.pwd && e.detail.value.length > 0) {
    //  console.log(1)
      this.setData({
        loginDisabled: false,
        finishBtnColor: '#fff',
        finishBtnBgColor: '#b61c25'
      })
    } else {
      this.setData({
        loginDisabled: true,
        finishBtnColor: '#b3b3b3',
        finishBtnBgColor: '#ebebeb'
      })
    }
  },

  phoneMove:function(e){
    var that = this;
    if (e.detail.value == "") {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return;
    }
    that.setData({
      mobile: e.detail.value
    })
  },

//获取用户输入的密码
  picCodeInput:function(e){   
      if (this.data.mobile && e.detail.value.length > 0) {
      this.setData({
        loginDisabled: false,
        finishBtnColor: '#fff',
        finishBtnBgColor: '#b61c25'
      })
    } else {
      this.setData({
        loginDisabled: true,
        finishBtnColor: '#b3b3b3',
        finishBtnBgColor: '#ebebeb'
      })
    }
  },

  pwdMove:function(e){
    if (e.detail.value == "") {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return;
    }
    this.setData({
      pwd: e.detail.value
    })
  },

//校验手机号码
checkPhone:function(param){
  var phone = util.regexConfig().phone;
  var inputPhone = param.phone.trim();
  if (phone.test(inputPhone)){
    return true;
  }else{
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '请输入正确的手机号码'
    });
    return false;
  }
},
//校验密码
checkPassword: function (param){
  var phone = param.phone.trim();
  var password = param.password.trim();
  if (password.length <= 0){
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '请输入密码'
    });
    return false;
  }else{
    return true;
  }
},

//检测用户信息
checkUserInfo: function (param){
  console.log(param)
  var that = this;
  that.setData({
    phone: param.phone
  })
  wx.showLoading({
    title: '加载中',
  })
  that.setData({
    loginDisabled:true,
    finishBtnColor: '#b3b3b3',
    finishBtnBgColor: '#ebebeb'
  })
  
  var phone = param.phone.trim();
  var password = param.password.trim();
  let data = {
    method: "getUser",
    loginName: phone,
    pwd: password,
    url_type: 'user'
  }
  console.log(data);
  api.reqData({
    data,
    success: (res) => {
    console.log(res.data)
    wx.hideLoading()
    if (res.data.success==1){
          try {
            wx.setStorageSync('Apptoken', res.data.result.rs[2].token)
            wx.setStorageSync('memberLevel', res.data.result.rs[0].memberLevel)
            wx.setStorageSync('hasLogin', true)
            wx.setStorageSync('parentUserHasMark', res.data.result.rs[1].parentUserHasMark)
          } catch (e) {
            console.log(e)
          }
          //全局变量          
          app.globalData.hasLogin = true,
          app.globalData.memberLevel = res.data.result.rs[0].memberLevel 
          app.globalData.Apptoken = res.data.result.rs[2].token  
          app.globalData.parentUserHasMark = res.data.result.rs[1].parentUserHasMark            
          //登陆成功，跳回上一页 后续再优化
          console.log(that.data.prevPage);
          if (that.data.prevPage == 'register') {
            console.log(that.data.prevPage)
            wx.switchTab({
              url: '/pages/index/index'
            })
          } else if (that.data.prevPage == 'mine' || that.data.prevPage == 'forgetPass'){
            console.log(that.data.prevPage)
            wx.switchTab({
              url: '/pages/index/index',
            })
          }else{
            wx.navigateBack({
              delta: 1
            })
          }                              
        } else if (res.data.success == 3){
          wx.hideLoading()
          wx.showToast({
            title: '用户或密码错误',
            icon: 'none',
          }) 
          that.setData({
            loginDisabled: false,
            finishBtnColor: '#fff',
            finishBtnBgColor: '#b61c25' 
          })  
        }
    },
    fail:function () {
    },
     
  })

},


//跳转忘记密码

toforget:function(){
  wx.navigateTo({
    url: '/pages/login/forget-pass/forget-pass',
  })
},
// 获取微信绑定的手机号
// usedMobile:function(e){
//   wx.login({
//     success: function (res) {
//       console.log(res.code)
//       // 注册用户
//       let data = {
//         method: "getSignPhone",
//         wxCode: res.code,
//         url_type: 'user'
//       }
//       api.reqData({
//         data,
//         success: (res) => {
//           console.log(res) 

//         },
//         fail: function () {
//         },
//       })
//     }
//   })

// },

//第三方登录微信授权
getPhoneNumber:function(e){ 
  var that = this;
  var phoneResult = e.detail;
  console.log(phoneResult);
  wx.showLoading({
    title: '加载中',
  })
  setTimeout(function () {
    wx.hideLoading()
  },2000)
  //获取微信绑定手机号1.调取微信api获取encryptedData，ivsession_key  2.调取破解手机的接口  3.调取判断手机号是否注册的接口
  wx.login({
    success: function (res) {
      console.log(res)
      let wxCode = res.code;
      var nw = res.data;
          console.log(nw);
          // console.log(nw.session_key)
          let data = {   //破解手机方法
            method: "getSignPhone",
            encryptedData: phoneResult.encryptedData,
            iv: phoneResult.iv,
            js_code: wxCode,
            url_type: 'myself'
          }
          api.reqData({
            data,
            success: (res) => {
              console.log(res);
              console.log(res.data);  //解析上面的电话号获得手机号
              if (res.data == "") {
                wx.showToast({
                  title: '授权失败，请重试',
                  icon: 'none',
                  duration: 3000
                })
              } else {
                var phone = res.data;
                let data = {
                  method: "getCheckPhoneWetCat",
                  phone: res.data,
                  url_type: 'user'
                }
                console.log(data);
                api.reqData({
                  data,
                  success: (res) => {
                    console.log(res);
                    if (res.data.success == 2) {   //用户不存在
                      wx.navigateTo({
                        url: '/pages/login/bindphone/bindphone?phone=' + phone + '&prevPage=' +

                        'register',
                      })
                    } else {
                      console.log(res)
                      try {
                        wx.setStorageSync('Apptoken', res.data.result.rs[2].token)
                        wx.setStorageSync('memberLevel', res.data.result.rs[0].memberLevel)
                        wx.setStorageSync('hasLogin', true)
                        wx.setStorageSync('parentUserHasMark', res.data.result.rs[1].parentUserHasMark)
                      } catch (e) {
                        console.log(e)
                      }
                      //全局变量          
                      app.globalData.hasLogin = true,
                        app.globalData.memberLevel = res.data.result.rs[0].memberLevel
                      app.globalData.Apptoken = res.data.result.rs[2].token
                      app.globalData.parentUserHasMark = res.data.result.rs[1].parentUserHasMark

                      if (that.data.prevPage == 'register') {
                        console.log(that.data.prevPage)
                        wx.switchTab({
                          url: '/pages/index/index'
                        })
                      } else {
                        console.log('三方登录');
                        wx.navigateBack({
                          delta: 1
                        })
                      }
                    }
                  },
                  fail: function () {
                  },

                })

              }

            }
          })
        }
   })
      
  },
             
// 已经注册过的用户获取用户信息
getInfo(){
  var that = this;
  wx.login({
    success:function(res){
      console.log(res);
      let data = {
        method:'loginByWetCat',
        url_type: 'user'
      }
      api.reqData({
        data,
        success: (res) => {
          console.log(res)  
          try {
            wx.setStorageSync('Apptoken', res.data.result.rs[2].token)
            wx.setStorageSync('memberLevel', res.data.result.rs[0].memberLevel)
            wx.setStorageSync('hasLogin', true)
            wx.setStorageSync('parentUserHasMark', res.data.result.rs[1].parentUserHasMark)
          } catch (e) {
            console.log(e)
          }
          //全局变量          
          app.globalData.hasLogin = true,
          app.globalData.memberLevel = res.data.result.rs[0].memberLevel 
          app.globalData.Apptoken = res.data.result.rs[2].token  
          app.globalData.parentUserHasMark = res.data.result.rs[1].parentUserHasMark         
          
          if (that.data.prevPage == 'register') {
            console.log(that.data.prevPage)
            wx.switchTab({
              url: '/pages/index/index'
            })
          } else {
            console.log('注册');
            wx.navigateBack({
              delta: 1
            })
          }       
    
        },
          fail: function () {
        },
      })
    }
  })
},

pddLogin:function(){
  let data={
    url_type:'user',
    method:'getPDDUrl'
  }
  api.reqData({
    data,
    success:function(res){
      console.log(res)
      wx.navigateTo({
        url:'/pages/login/pddLogin/pddLogin?url='+res.data.result.rs[0].result
      })
    }
  })
},



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options);
    var that = this;
    that.setData({
      prevPage : options.prevPage
    })


    wx.getSetting({
      success: res => {
        console.log("------------ onLaunch wx.getSetting res-------------")
        console.log(res)

        if (res.authSetting['scope.PhoneNumber']) {
          // 已经授权，可以直接调用 PhoneNumber 获取头像昵称，不会弹框
          wx.getPhoneNumber({
            success: res => {
              console.log(res.PhoneNumber);
              // 可以将 res 发送给后台解码出 unionId
              //  this.globalData.userInfo = res.userInfo

              // 由于 getPhoneNumber 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.PhoneNumberReadyCallback) {
                this.PhoneNumberReadyCallback(res)
               }
            }
          })
        }
      },
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
  
  },
    // 点击充值弹窗  
  trigger: function () {
    var that = this;
    that.setData({  
      showModal: true  
    })  
  },  
  preventTouchMove: function () {  
    
    },  
    
  close_mask: function () {  
    this.setData({  
      showModal: false  
    })  
  },  
})
