// pages/mine/basicmsg/basicmsg.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    phone:"",
    gender:""
  },

  //跳转我的收获地址页面
  tomyaddress : function(){
    wx.navigateTo({
      url: '/pages/mine/myaddress/myaddress',
    })
  },
  //改变日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
//改变性别
  changeGender : function(){
    const that = this
    wx.showActionSheet({
      itemList: ['男', '女'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0){
          that.setData({
            gender:"男"
          })
        }else{
          that.setData({
            gender: "女"
          })
        }
        wx.setStorageSync('gender',that.data.gender)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone:options.phone
    })
    var genderSave = wx.getStorageSync('gender');
    if(genderSave){
      this.setData({
        gender:genderSave
      })
    }else{
      this.setData({
        gender:'未知'
      })
    }

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
    //获取头像
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        // hasUserInfo: true
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            // hasUserInfo: true
          })
        }
      })
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