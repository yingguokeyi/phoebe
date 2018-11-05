// pages/mine/install/install.js

const app = getApp()
const api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  noOpen:function(){
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000
    })
  },

  resetPass:function(){
    wx.navigateTo({
      url:'/pages/mine/resetPass/resetPass'
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
      url: '../../index/index'
    })
  },

  aboutus:function(){
     wx.navigateTo({
       url:'/pages/mine/ser-center/aboutus/aboutus'
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.hasLogin == true) {
      this.setData({
        hasLogin:true
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