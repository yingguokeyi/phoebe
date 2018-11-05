// pages/mine/news/news.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    youhui:'',
    system:'',
  },

  systemNew:function(e){
    let type = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:'/pages/mine/systemNew/systemNew?type='+type
    })
  },

  getNews:function(){
    let that = this;
    let data = {
      method:'messageInfoList',
      url_type:'member',
      memberLevel:app.globalData.mLevel,
    }
    api.reqData({
      data,
      success:function(res){
        console.log(res.data.result.rs)
        that.setData({
          youhui:res.data.result.rs[1].message_context,
          system:res.data.result.rs[0].message_context
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNews()
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

})