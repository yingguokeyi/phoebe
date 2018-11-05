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
    finishBtnColor: '#b3b3b3',  //完成按钮的字体颜色
    finishBtnBgColor: '#ebebeb',  //完成按钮的背景
    nextBtnDisabled: true,
    phoneNum: '',
    key: "",
    imgcode: '',
    mobile:"",

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
    var that = this;
    let value = e.detail.value;
    value = value.split('');
    if(value[0] != 1){
      wx.showToast({
        title:'手机号格式不正确',
        icon:'none'
      })
      return ;
    }else{
      that.setData({
        mobile:e.detail.value
      })
      if (that.data.imgcode && e.detail.value.length > 0) {
        this.setData({
          nextBtnDisabled: false,
          finishBtnColor: '#fff',
          finishBtnBgColor: '#b61c25'
        })
      } else {
        this.setData({
          nextBtnDisabled: true,
          finishBtnColor: '#b3b3b3',
          finishBtnBgColor: '#ebebeb'
        })
      }
    }
  },

  phoneMove:function(e){   //用户名input离开事件
    this.checkUserName(e.detail.value)
  },

  formSubmit: function (e) {
    var param = e.detail.value;
    console.log(param)
    this.mysubmit(param);
  },



  picGaph: function (e) {
    if (this.data.mobile && e.detail.value.length > 0) {
      this.setData({
        nextBtnDisabled: false,
        finishBtnColor: '#fff',
        finishBtnBgColor: '#b61c25'
      })
    } else {
      this.setData({
        nextBtnDisabled: true,
        finishBtnColor: '#b3b3b3',
        finishBtnBgColor: '#ebebeb'
      })
    }
  },
  mysubmit: function (param) {
    var num = param.username.trim();
    var flag = this.checkUserName(num) && this.checkSmsCode(param)
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


  // checkPassword: function (param) {
  //   var userName = param.username.trim();
  //   var password = param.password.trim();
  //   if (password.length <= 0) {
  //     wx.showModal({
  //       title: '提示',
  //       showCancel: false,
  //       content: '请设置新密码'
  //     });
  //     return false;
  //   } else if (password.length < 6 || password.length > 20) {
  //     wx.showModal({
  //       title: '提示',
  //       showCancel: false,
  //       content: '密码长度为6-20位字符'
  //     });
  //     return false;
  //   } else {
  //     return true;
  //   }
  // },
  //获取用户输入的用户名
  // getFigure: function (e) {
  //   var that = this;
  //   if (e.detail.value == "") {
  //     wx.showToast({
  //       title: '请输入手机号',
  //       icon: 'none'
  //     })
  //   }
  //   that.setData({
  //     mobile: e.detail.value
  //   })
  // },

  //获取用户输入的图形验证码
  picCodeInput: function (e) {
    if (e.detail.value == "") {
      wx.showToast({
        title: '请输入图片验证码', 
         
        icon: 'none'
      })
    }
    this.setData({
      imgcode: e.detail.value
    })
  },

  getSmsCode: function () {
    var phone = this.data.phoneNum;
    var newimgCode = this.data.imgcode.toUpperCase()
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false;
    } else {
      var phoneTest = util.regexConfig().phone;
      if (!phoneTest.test(phone)) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请输入正确的手机号码'
        });
        return false;
      }
    }
    if (!newimgCode) {
      wx.showToast({
        title: '请输入图片验证码',
        icon: 'none'
      })
      return false;
    }
    var that = this;
    var count = 60;

    //调用获取验证码接口
    let data = {
      method: "getVerificationCode",
      phone: that.data.phoneNum,
      key: that.data.key,
      imgCode: newimgCode,
      url_type: 'user'
    }
  },

  checkSmsCode: function (param) {   //下一步提交
    var that = this;
    var picCode = param.picCode.toUpperCase();   //图片验证码
    var phone = param.username;   //用户名
    if (!picCode) {
      wx.showToast({
        title: '请输入图片验证码',
        icon: 'none'
      })
      return false;
    }
   
    //调用重置密码接口
    wx.showLoading({     //加载中图标
      title: '加载中',
    })
    this.setData({
      finishBtnBgColor: '#ebebeb',
      nextBtnDisabled: true
    })
    let data = {
      method: "getCheckCodeAndPhone",
      phone: phone,
      key: this.data.key,
      imgCode: picCode,
      url_type: 'user'
    }
    api.reqData({
      data,
      success:(res) => {
        console.log(res.data)
        if(res.data.success == 3){   //用户已存在
          setTimeout(function () {
            wx.navigateTo({
              url: '../find-password/find-password?phone='+that.data.mobile,
            })
          })
        }else if(res.data.success == 1){
          wx.showModal({
            content: '改手机号未注册，请先注册',
            showCancel: true,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/register/register',
                })
              }else if (res.cancel) {
                this.setData({
                  nextBtnDisabled: false,
                  finishBtnColor: '#fff',
                  finishBtnBgColor: '#b61c25'
                })
              }
            }
          })
        }else if(res.data.success == 4){
          wx.showToast({
            title:res.data.errorMessage
          })
          this.getpiccode();
          this.setData({
            nextBtnDisabled: false,
            finishBtnColor: '#fff',
            finishBtnBgColor: '#b61c25'
          })
        }
      }
    })
    // api.reqData({
    //   data,
    //   success: (res) => {
    //     if (res.data.success == 1) {
    //       wx.showToast({
    //         title: '修改密码成功',
    //         duration: 2000
    //       })
    //       setTimeout(function () {
    //         wx.navigateTo({
    //            url: '/pages/login/login?prevPage=' + 'forgetPass',
    //         })
    //       }, 2000);

    //     } else {
    //       wx.showToast({
    //         title: res.data.errorMessage,
    //         duration: 2000
    //       })
    //       this.getpiccode();
    //       this.setData({
    //         saveBtnBack: '#ebebeb',
    //         saveBtnDisabled: false
    //       })
    //     }
    //   },
    //   fail: function () {
    //     console.log(res.data.errorMessage)
    //   },
    // })
    
  },
})