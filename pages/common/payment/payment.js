// pages/common/payment/payment.js
const App = getApp();
const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentType: 0,////页面跳转

  },
   //跳转
  submitoder(e) {
    App.globalData.currentType = 2,
    App.globalData.status = 106,
    wx.redirectTo({
      url: '/pages/mine/order-list/order-list'
    })
  },
  //跳转
  buysubmit(e){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //  setTimeout(function(){
  //      App.globalData.currentType = 2,
  //      App.globalData.status = 106,
  //      wx.redirectTo({
  //        url: '/pages/mine/order-list/order-list'
  //      })
  //  },3000) 
   
    if(options.source == "LB"){
      App.globalData.memberLevel=1 
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