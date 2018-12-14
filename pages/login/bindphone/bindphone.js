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
    getSmsCodeBtnBgColor: "#fff",
    finishBtnColor: '#b3b3b3',  //完成按钮的字体颜色
    finishBtnBgColor: '#ebebeb',  //完成按钮的背景
    btnLoading: false,
    registDisabled: true,
    smsCodeDisabled: false,
    inputUserName: '',
    inputPassword: '',
    logIcon: "../../image/phone.png",
    showType: 'password',
    pwdIcon: "../../../image/eye.png",
    key: '',
    imgcode: '',
    mobile: '',
    pwd: '',
    timeStatus: false,
    timeDown: '',
    count: '',
    authcode:'',
    wxcode:'',
    prevPage:''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    console.log(app.globalData.wxcode)
    this.setData({
      mobile: options.phone,
      prevPage: (options.prevPage == null) ? null: options.prevPage
    })
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

//提交
  formSubmit: function (e) {
    var param = e.detail.value;
    console.log(param)
    this.mysubmit(param);
  },
//暴露
  mysubmit: function (param) {
    var flag = this.checkUserName(param) && this.checkSmsCode(param)
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

  //获取用户输入的用户名
  mobil: function (e) {
    console.log(e);
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
  //手机号判断
  checkUserName: function (param) {
    var phone = util.regexConfig().phone;
    var inputUserName = param.username.trim();
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
  
  // 输入电话号和图片是时下一步按钮变色
  phoneInput: function (e) {
    // console.log(e.detail.value)
    if (this.data.authcode && e.detail.value.length > 0) {
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
  
  //获取验证码
  codeMove: function (e) {
    if (e.detail.value == "") {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return;
    }
    this.setData({
      authcode: e.detail.value
    })
  },
  // 判断验证码和电话号码有误完成按钮变色
  inputcode: function (e) {
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
 
  //获取用户输入的用户名
  userNameInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  //获取用户输入的邀请码
  picCodeInput: function (e) {
    // console.log('e');
    var myreg = /^1\d{10}$/;   //正则进行判断电话号码
    if (e.detail.value) {   //有没有邀请值都能注册
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
          viccode: e.detail.value,//用户输入邀请码
          registDisabled: false,
          finishBtnColor: '#fff',
          finishBtnBgColor: '#b61c25'
        })
      }
    }
  },

  //得到短信验证码
  getcode: function (countdown) {
     console.log(countdown)
    var that = this;
    var newimgCode = that.data.imgcode.toUpperCase();
    if (!that.data.mobile) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false;
    } else {
      var phone = util.regexConfig().phone;
      console.log(phone);
      if (!phone.test(that.data.mobile)) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请输入正确的手机号码'
        });
        return false;
      }
    }
    console.log(that.data.smsCodeDisabled)
    let data = {
      method: "getVerificationCodeOptimize",
      phone: that.data.mobile,
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
          wx.showToast({
            title: '验证码发送成功',
            icon: 'none'
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


  //获取js_code
  getJscode() {
    const self = this;
    //发起网络请求
    wx.login({
      success: function (res) {
        if (res.code) {
          self.setData({
            wxcode: res.code
          })
          console.log(res.code);
        }
      }
    })
  },


  //点击完成触发事件

  checkSmsCode: function (param) {
    console.log(param)
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    //正则进行判断电话号码
    var myreg = /^1\d{10}$/;
    if (param.picCode) {
      if (!myreg.test(param.picCode)) {
        console.log('手机号');
        wx.showToast({
          title: '邀请电话号码错误',
          icon: 'none'
        })
        this.setData({
          registDisabled: true,
          finishBtnColor: '#b3b3b3',
          finishBtnBgColor: '#ebebeb'
        })
        return false;
      } else {
        // console.log('q');
        this.setData({
          registDisabled: false,
          finishBtnColor: '#fff',
          finishBtnBgColor: '#b61c25'
        })

      }

    }else if (!param.smsCode) {  //图片验证码是否为空
      let hint = '请填写短信验证码'
      that.hintMould(hint);
      return false;
    }
    that.setData({
      registDisabled: true,
      finishBtnColor: '#b3b3b3',
      finishBtnBgColor: '#ebebeb'
    })


    wx.login({
      success: function (res) {
        console.log(res.code)
        // 注册用户
        let data = {
          method: "addUserOptimize",
          phone: param.username,
          code: param.smsCode,
          inviteCode: param.inviteCode,
          pwd: "",
          source: 1,
          wxCode:res.code,
          url_type: 'user'
        }
        api.reqData({
          data,
          success: (res) => {
            console.log(res)
             if(res.data.success == 1){//注册成功,邀请用户存在
              wx.showLoading({
                title: '注册登录成功',
              }) 
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
              } else if (that.data.prevPage == 'mine' || that.data.prevPage == 'forgetPass') {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }       
            } else if (res.data.success == 2) {//短信验证码错误
              wx.showToast({
                title: res.data.errorMessage,
                icon: 'none'
              })
              that.setData({
                registDisabled: false,
                finishBtnColor: '#b3b3b3',
                finishBtnBgColor: '#ebebeb'
              })
            
            } else if (res.data.success == 2) {  //获取open_id失败
              wx.showToast({
                title: res.data.errorMessage,
                icon: 'none'
              })
              that.setData({
                registDisabled: false,
                finishBtnColor: '#b3b3b3',
                finishBtnBgColor: '#ebebeb'
              })
             } else if (res.data.success == 3) {  //邀请人不存在
               wx.showToast({
                 title: res.data.errorMessage,
                 icon: 'none'
               })
             }
            
            
          },
          fail: function () {
          },
        })
      }
    })
  
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


