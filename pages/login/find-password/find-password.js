var util = require("../../../utils/util.js");
const api = require('../../../utils/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    getSmsCodeBtnTxt: "获取验证码",
    getSmsCodeBtnColor: "#b61c25",
    saveBtnBack: '#ebebeb',
    saveBtnDisabled: true,
    saveBtnColor:'#b3b3b3',
    // smsCodeDisabled: false,
    phoneNum: '',
    key: "",
    smscode: '',   //短信验证码
    pwd:"",
    findIcon:"../../../image/eye.png",
    showType: 'password',
    phone:'',
    showInfo:false   //短信验证码发送提示

  },

  //得到图片验证码
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone:options.phone
    })
    this.getpiccode()
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
  //事件处理函数
  getPhoneNum: function (e) {
    var value = e.detail.value;
    this.setData({
      phoneNum: value
    });
  },
  formSubmit: function (e) {
    var param = e.detail.value;
    this.mysubmit(param);
  },
  mysubmit: function (param) {
    var flag = this.checkPassword(param) && this.checkSmsCode(param)
    var that = this;
    if (flag) {
      setTimeout(function () {
        wx.showToast({
          title: '成功',
          icon: 'success',
        });
      }, 500);
    }
  },

  checkUserName: function (num) {
    //调用util中手机号码的正则校验
    var phone = util.regexConfig().phone;
    if (phone.test(num)) {
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


  checkPassword: function (param) {
    var password = param.password.trim();
    if (password.length <= 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请设置新密码'
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


  pwdMove:function(e){
    if (e.detail.value == "") {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return ;
    }else if(e.detail.value.length < 6 || e.detail.value.length > 20) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '密码长度为6-20位字符'
      });
      return false;
    } else{
      this.setData({
        pwd: e.detail.value
      })
    }  
  },
  //获取用户输入的密码
  pwdInput: function (e) {
    var that = this;
    if (that.data.smscode && e.detail.value.length > 0) {
      that.setData({
        saveBtnDisabled: false,
        saveBtnColor: '#fff',
        saveBtnBack: '#b61c25'
      })
    } else {
      that.setData({
        saveBtnDisabled: true,
        saveBtnColor: '#b3b3b3',
        saveBtnBack: '#ebebeb'
      })
    }
  },

  codeMove:function(e){
    var that = this;
    if (e.detail.value == "") {
      wx.showToast({
        title: '请输入短信验证码',
        icon: 'none'
      })
      return ;
    }
    that.setData({
      smscode: e.detail.value
    })
  },

  codeInput:function(e){
    var that = this;
    if (that.data.pwd && e.detail.value.length > 0) {
      that.setData({
        saveBtnDisabled: false,
        saveBtnColor: '#fff',
        saveBtnBack: '#b61c25'
      })
    } else {
      that.setData({
        saveBtnDisabled: true,
        saveBtnColor: '#b3b3b3',
        saveBtnBack: '#ebebeb'
      })
    }
  },


  getSmsCode: function () {
    // var phone = this.data.phoneNum;
    // var newimgCode = this.data.imgcode.toUpperCase()
    //  if (!phone) {
    //   wx.showToast({
    //     title: '请输入手机号',
    //     icon: 'none'
    //   })
    //   return false;
    // } else {
    //   var phoneTest = util.regexConfig().phone;
    //   if (!phoneTest.test(phone)) {
    //     wx.showModal({
    //       title: '提示',
    //       showCancel: false,
    //       content: '请输入正确的手机号码'
    //     });
    //     return false;
    //   }
    // }
    // if (!newimgCode) {
    //   wx.showToast({
    //     title: '请输入图片验证码',
    //     icon: 'none'
    //   })
    //   return false;
    // }
    var that = this;
    var count = 60;

    //调用获取验证码接口
    let data = {
      method: "getVerificationCodeOptimize",
      phone: that.data.phone,
      url_type: 'user'
    }
    api.reqData({
      data,
      success: (res) => {
        console.log(res.data)
        if (res.data.success == 1) {
          // wx.showToast({
          //   title: '验证码发送成功',
          //   icon: 'success'
          // })
          that.setData({
            showInfo:true
          })
          var si = setInterval(function () {
            if (count > 0) {
              count--;
              that.setData({
                getSmsCodeBtnTxt: count + ' s',
                getSmsCodeBtnColor: "#cbcbcb",
                smsCodeDisabled: true
              });
            } else {
              that.setData({
                getSmsCodeBtnTxt: "获取验证码",
                getSmsCodeBtnColor: "#CCA86A",
                smsCodeDisabled: false
              });
              count = 60;
              clearInterval(si);
            }
          }, 1000);
        } else {
          wx.showToast({
            title: res.data.errorMessage,
            icon: 'none'
          })
          this.getpiccode()
        }
      },

    })

  },

  checkSmsCode: function (param) {   //完成按钮的判断
    var smsCode = param.smsCode;  //短信验证码
    var password = param.password;
    if (!smsCode) {
      wx.showToast({
        title: '请输入短信验证码',
        icon: 'none'
      })
      return false;
    }
    if (!password) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      })
      return false;
    }
    //调用重置密码接口
    wx.showLoading({     //加载中图标
      title: '加载中',
    })
    this.setData({
      saveBtnColor: '#b3b3b3',
      saveBtnBack: '#ebebeb',
      saveBtnDisabled: true
    })
    let data = {
      method: "resetPWDOptimize",
      phone: this.data.phone,
      pwd: password,
      code: smsCode,
      url_type: 'user'
    }
    api.reqData({
      data,
      success: (res) => {
        console.log(res.data)
        if (res.data.success == 1) {
          wx.showToast({
            title: '修改密码成功',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateTo({
               url: '/pages/login/login?prevPage=' + 'forgetPass',
            })
          }, 2000);

        } else {
          wx.showToast({
            title: res.data.errorMessage,
            duration: 2000
          })
          this.getpiccode();
          this.setData({
            saveBtnColor:'#fff',
            saveBtnBack: '#b61c25',
            saveBtnDisabled: false
          })
        }
      },
      fail: function () {
        console.log(res.data.errorMessage)
      },
    })

  },

  // 点击密码显示
  hideShowPsw: function () {
    var that = this;
    if (that.data.showType == 'password') {
      // console.log(1)
      that.setData({
        findIcon: '../../../image/kk.png',
        showType: 'text'
      })
    } else if (that.data.showType == 'text') {
      // console.log(2)
      that.setData({
        findIcon: '../../../image/eye.png',
        showType: 'password'
      })
    }
  },
})