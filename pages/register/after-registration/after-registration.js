var util = require("../../../utils/util.js");
var api = require("../../../utils/api.js");
const app = getApp();

Page({
  data: {
    registBtnTxt: "完成",
    registBtnBgBgColor: "#ebebeb",
    registBtnBgBgColor: "",
    smsCodeBtnTxt: "获取验证码",
    getSmsCodeBtnColor: "#b61c25",
    getSmsCodeBtnBgColor:"#fff",
    finishBtnColor: '#b3b3b3',  //完成按钮的字体颜色
    finishBtnBgColor: '#ebebeb',  //完成按钮的背景
    btnLoading: false,
    registDisabled: true,
    smsCodeDisabled: false,
    inputUserName: '',
    inputPassword: '',
    logIcon: "../../image/phone.png",
    showType:'password',
    pwdIcon: "../../../image/eye.png",
    key: '',
    imgcode: '',
    viccode:'',
    mobile: '',
    pwd: '',
    timeStatus: false,
    timeDown: '',
    count: '',
    authcode:'',
    phone:'',
    js_code: '',
    showInfo:false, //发送短信提示
    inviteCode:'',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
    var that = this;
    if(app.globalData.inviteCode){
      that.setData({
        inviteCode:app.globalData.inviteCode
      })
    }
    that.setData({
      phone: options.phone
    })
    console.log(this.data.showInfo)
    this.getpiccode()
    this.getJscode()
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

  mysubmit: function (param) {
    console.log(param)
    var flag =  this.checkPassword(param) && this.checkSmsCode(param)
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
 
  // 密码
  checkPassword: function (param) {
    var smsCode = param.smsCode.trim();
    var password = param.password.trim();
    if (password.length <= 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请设置密码'
      });
      return false;
    } else if (password.length < 6 || password.length > 20) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '密码长度为6-20位字符'
      });
      return false;
    } else {
      return true;
    }
  },
  

  // showToast模板
  hintMould(titleText) {
    wx.showToast({
      title: titleText,
      icon: 'none'
    })
  },

  //得到验证码key
  getpiccode() {
    var str = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var key = ''
    for (var i = 0; i < 32; i++) {
      var r = Math.floor(Math.random() * 32);     //取得0-32间的随机数，目的是以此当下标取数组data里的值！  
      key += str[r];        //输出20次随机数的同时，让rrr加20次，就是20位的随机字符串了。  
    }
    console.log(key)
    this.setData({
      key: key
    })
  },
  //点击更换图形验证码
  changeCode: function () {
    this.getpiccode()
  },


  //获取用户输入的用户名
  userNameInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  //获取用户输入的密码
  pwdInput: function (e) {
     if (e.detail.value.length > 0 && this.data.authcode) {
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

  pwdMove:function(e){
    if (e.detail.value == "") {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return ;
    }
    this.setData({
      pwd: e.detail.value
    })
  },

  //获取用户输入的邀请码
  picCodeInput: function (e) {
    console.log('e');
    var myreg = /^1\d{10}$/;   //正则进行判断电话号码
    if(e.detail.value){   //有没有邀请值都能注册
      if (!myreg.test(e.detail.value)) {  //判断邀请值是不是电话号
      console.log('手机号');
       wx.showToast({
         title: '邀请电话号码错误',
         icon: 'none'
       })
        this.setData({
          registDisabled: true,
        })
        return false;
      } else {
        this.setData({
          viccode:e.detail.value,//用户输入邀请码
          registDisabled: false,
          finishBtnColor: '#fff',
          finishBtnBgColor: '#b61c25'
        })
      }
    }
  },
// 获取验证码
  inputcode:function(e){
    if (this.data.pwd && e.detail.value.length > 0) {
        console.log(1)
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
 
  codeMove:function(e){
    if (e.detail.value == "") {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return ;
    }
  this.setData({
     authcode: e.detail.value
    })
  },

  //获取js_code
  getJscode() {
    const self = this;
    //发起网络请求
    wx.login({
      success: function (res) {
        if (res.code) {     
          self.setData({
            js_code: res.code
          })
          console.log(res.code);
        }
      }
    })
  },

  //得到短信验证码
  getcode: function (countdown) {
    console.log(countdown)
    var that = this;
    console.log(that.data.smsCodeDisabled)
    let data = {
      method: "getVerificationCodeOptimize",
      phone:that.data.phone,
      url_type: 'user'
    }
    api.reqData({
      data,
      success: (res) => {
        console.log(res)
        that.setData({
          smsCodeDisabled: true
        })
        if (res.data.success == 1) {
          that.setData({
            showInfo:true
          })
          if (countdown) {
            interval = setInterval(() => {
              count_down(that);
            }, 1000);
          }
        } else if (res.data.success == 2) {    //验证码已经发送，几秒后再发送
          wx.showToast({
            title: res.data.errorMessage,
            icon: 'none'
          })
          that.getpiccode();
          let tll = res.data.result.rs[0].tll
          this.setData({
            timeDown: tll,
            timeStatus: true
          })
        } else if (res.data.success == 3) {
          //短信发送失败
          wx.showToast({
            title: res.data.errorMessage,
            icon: 'none'
          })
          that.getpiccode()
        }
      },
    })

    // 

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

  checkSmsCode: function (param) {
    var that = this;
    that.setData({
      registDisabled: true,
      finishBtnColor: '#b3b3b3',
      finishBtnBgColor: '#ebebeb'
    })
    //正则进行判断电话号码
    var myreg = /^1\d{10}$/; 
    if (param.picCode) {
      if (!myreg.test(param.picCode)) {
        wx.showToast({
          title: '邀请电话号码错误',
          icon: 'none'
        })
       
        return false;
      } 
    }
    // 注册用户
    let data = {
      method: "addUserOptimize",
      phone: that.data.phone,
      pwd: param.password,
      code: param.smsCode,
      inviteCode:param.inviteCode,
      wxCode:that.data.js_code,
      source: 1,
      wxcode: app.globalData.wxcode,
      url_type: 'user'
    }
    api.reqData({
      data,
      success: (res) => {
        console.log(res)
        if (res.data.success == 1) {  //注册成功
          wx.showLoading({
            title: '注册成功',
          })
          that.setData({
            registDisabled: false,
            finishBtnColor: '#fff',
            finishBtnBgColor: '#b61c25'
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/login/login?prevPage=' + 'register',
            })
          }, 2000);
        } else if (res.data.success == 2) {   //短信验证码错误
          wx.showToast({
            title: res.data.errorMessage,
            icon: 'none'
          })
          that.setData({
            registDisabled: false,
            finishBtnColor: '#fff',
            finishBtnBgColor: '#b61c25'
          })
          that.getpiccode()
        } else if (res.data.success == 3) {   //邀请人不存在
          wx.showToast({
            title: res.data.errorMessage,
            icon: 'none'
          })
          that.setData({
            registDisabled: false,
            finishBtnColor: '#fff',
            finishBtnBgColor: '#b61c25'
          })
          that.getpiccode()
        }
      },
      fail: function () {
      },
    })
  },


// 点击图片密码可见和不可见
   //隐藏text block，显示password block  
  hideShowPsw: function () {
    var that = this;
    if (that.data.showType == 'password'){
      // console.log(1)
      that.setData({
        pwdIcon:'../../../image/kk.png',
        showType:'text'
      })
    } else if (that.data.showType == 'text'){
      // console.log(2)
      that.setData({
        pwdIcon: '../../../image/eye.png',
        showType: 'password'
      })
    }
  },

})


var interval;

/* 秒级倒计时 */
function count_down(that) {
  var count = that.data.count
  if (count > 0) {
    that.setData({
      smsCodeBtnTxt: count-- + ' s',
      getSmsCodeBtnColor: "#999",
      smsCodeDisabled: true,
      count: count--
    });
  } else {
    that.setData({
      smsCodeBtnTxt: "获取验证码",
      getSmsCodeBtnColor: "#CCA96A",
      smsCodeDisabled: false
    });
  }
}


