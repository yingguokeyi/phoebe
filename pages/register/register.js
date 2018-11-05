var util = require("../../utils/util.js");
var api = require("../../utils/api.js");
const app = getApp();

Page({
  data: {
    registBtnTxt: "下一步",
    registBtnBgBgColor: "#ebebeb",
    finishBtnColor: '#b3b3b3',  //完成按钮的字体颜色
    finishBtnBgColor: '#ebebeb',  //完成按钮的背景
    registBtnBgBgColor: "",
    smsCodeBtnTxt: "获取验证码",
    getSmsCodeBtnColor: "#b61c25",
    btnLoading: false,
    registDisabled: true,
    smsCodeDisabled: true,
    inputUserName: '',
    inputPiccode:'',
    inputPassword: '',
    logIcon: "../../image/phone.png",
    pwdIcon: "../../image/code.png",
    key:'',
    phone:'',
    imgCode:'',
    mobile:'',
    pwd:'',
    timeStatus:false,
    timeDown:'',
    count:'',
    pageInfo :'reg',
    source:'',
    wxCode:'',
    inviteCode:'',
   
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
    console.log(app.globalData.wxcode)
    this.getpiccode()
  },
  onReady: function () {
    // 页面渲染完成


  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },


  formSubmit: function (e) {
    var param = e.detail.value;
    console.log(param)
    this.mysubmit(param);
  },
   // 输入电话号和图片是时下一步按钮变色
  phoneInput:function(e){
    // console.log(e.detail.value)
    if (this.data.imgcode && e.detail.value.length > 0) {
      // console.log(1)
      this.setData({
        registDisabled: false,
        finishBtnColor: '#fff',
        finishBtnBgColor: '#b61c25'
      })
    } else {
      this.setData({
        registDisabled: true,
        finishBtnColor: '#b3b3b3',
        finishBtnBgColor: '#ebebeb'
      })
    }
  },
 
  picCodeInput: function (e) {
    // console.log(e.detail.value)
    if (this.data.mobile && e.detail.value.length > 0) {
      // console.log(1)
      this.setData({
        registDisabled: false,
        finishBtnColor: '#fff',
        finishBtnBgColor: '#b61c25'
      })
    } else {
      this.setData({
        registDisabled: true,
        finishBtnColor: '#b3b3b3',
        finishBtnBgColor: '#ebebeb'
      })
    }
  },
  mysubmit: function (param) {
     // 进行判断是否有电话号和图片验证码，有进行下一步
    var flag = this.checkUserName(param) && this.checkSmsCode(param)
     //console.log(flag)
    var that = this;
    if (flag) {
      setTimeout(function () {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1500
        });
      }, 1000);
    }
  },
  // 判断电话号
   checkUserName: function (param) {
     console.log(param);
     var phone = util.regexConfig().phone;
     
     var inputUserName = param.username.trim();
     //console.log(phone)
     console.log(inputUserName)
      if (phone.test(inputUserName)) {
      return true;
     } else {
         wx.showModal({
           title: '提示',
           showCancel: false,
           content: '请输入正确的手机号码'
        });
         return false;
      }
    },
   // showToast模板
  hintMould(titleText){
    wx.showToast({
      title: titleText,
      icon:'none'
      })
  },
//得到验证码key
getpiccode(){
  var str = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var key = ''
    for (var i = 0; i < 32; i++) {
      var r = Math.floor(Math.random() * 32);     //取得0-32间的随机数，目的是以此当下标取数组data里的值！  
      key += str[r];   //输出20次随机数的同时，让rrr加20次，就是20位的随机字符串了。
    }     
    console.log(key)
    this.setData({
      key: key
    })
},
//点击更换图形验证码
  changeCode:function(){
    this.getpiccode()
  },


 //获取用户输入的用户名
  mobil: function (e) {
    var that = this;
    if (e.detail.value == "") {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    } 
     that.setData({
      mobile: e.detail.value
    })
  },
//获取用户输入的密码
  picture:function(e){
     this.setData({
       pwd:e.detail.value
     })
     
  },

  //获取用户输入的图形验证码
  picInput: function (e) {
    var that = this;
    if (e.detail.value == "") {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    }
    that.setData({
      imgcode: e.detail.value,   //用户输入
      smsCodeDisabled: false
    })
  },
  
//得到短信验证码
  getcode:function (countdown) {
    console.log(countdown)
    var that = this;
    var newimgCode = that.data.imgcode.toUpperCase();
    if(!that.data.mobile){
      wx.showToast({
        title: '请输入手机号',
        icon:'none'
      })
      return false;
    }else{
      var phone = util.regexConfig().phone;
      if (!phone.test(that.data.mobile)){
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请输入正确的手机号码'
        });
        return false;
      }
    }
    if(!newimgCode){
      wx.showToast({
        title: '请输入图片验证码',
        icon:'none'
      })
      return false;
    } 
     console.log(that.data.smsCodeDisabled)
    // let data = {
    //   method: "getCheckCodeAndPhone",
    //   phone: that.data.mobile,
    //   key: that.data.key,
    //   imgCode: newimgCode,
    //   url_type: 'user'
    // }
    // api.reqData({
    //   data,
    //   success: (res) => {
    //     console.log(res)
    //     if (res.data.success == 1) {
    //       console.log("w");
    //       setTimeout(function () {
    //         wx.navigateTo({
    //           url: 'after-registration/after-registration',
    //         })
    //       }, 2000)
    //     }

    //   },
    //   fail: function () {
    //   },

    // })


    
    clearInterval(interval);

    let count = "";
    if (that.data.timeStatus) {
      count = that.data.timeDown;
    } else {
      count = 60
    }

    that.setData({
      count: count,
    });

      //倒计时
  
  },
 
// 判断图片验证码
  checkSmsCode: function (param) {
    var that = this;
    console.log(param)
    var newimgCode = that.data.imgcode.toUpperCase()
    //图片验证码是否为空
    if(!newimgCode){  
      let hint = '请填写图片验证码'
      that.hintMould(hint);
      return false;
    } 
    
    that.setData({
      registDisabled: true,
      finishBtnColor: '#b3b3b3',
      finishBtnBgColor: '#ebebeb'

    })
     // 注册用户
    let data = {
      method: "getCheckCodeAndPhone",
      phone: that.data.mobile,
      key: that.data.key,
      imgCode: newimgCode,
      source: 1,
      url_type: 'user'
    }
    api.reqData({
      data,
      success: (res) => {
        console.log(res)   
        if (res.data.success == 1){
          setTimeout(function () {
            wx.hideLoading()
            wx.navigateTo({
              //url: '/pages/login/login?prevPage='+'register', 
              url: 'after-registration/after-registration?phone='+that.data.mobile,//把手机号传到下一个页面
            }) 
          })
        } else if (res.data.success == 4){
          wx.showToast({
            title: res.data.errorMessage,
            icon: 'none'
          })
          that.getpiccode()
        }else if(res.data.success == 3){
            wx.showModal({
            content: '该手机号已注册，请直接登录',
            success: function (res) {
              if (res.confirm) {
                console.log("1");
                wx.navigateTo({
                  url: '../login/login?prevPage=' + 'register',
                })
              } else if (res.cancel) {
               console.log('用户点击取消')
              }
            }
          })

        }
       
      },
      fail: function () {
      },
      
    })
   
  },
  // 点击请登录触发事件
  skip: function(){
    wx.navigateTo({
      url: '../login/login?prevPage=' + 'register',
    })
  },
 
})

var interval;
