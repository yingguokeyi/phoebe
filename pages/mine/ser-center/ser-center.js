// pages/mine/ser-center/ser-center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },


  //跳转关于我们页面
  toaboutus:function(){
     wx.navigateTo({
       url: '/pages/mine/ser-center/aboutus/aboutus',
     })
  },

  //联系客服
  tellService : function(){
    wx.showModal({
      title: '提示',
      content: '400-0000-0000',
      showCancel:false
    })
  },
  //跳转帮助中心
  tohelp : function(){
   wx.navigateTo({
     url: '/pages/mine/ser-center/help-center/help-center',
   })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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