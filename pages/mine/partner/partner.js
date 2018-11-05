// pages/mine/partner/partner.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberLevel: app.globalData.mLevel,
    isSub:false,
  },
 
  partner:function(){
    // 判断有没有已完成订单
    let that = this;
    if (app.globalData.mLevel == 1){
      let data = {
        method:'addApplyMemberLevel',
        token : app.globalData.Apptoken,
        applyLevel:2,
        url_type:'myself'
      }
      api.reqData({
        data,
        success:function(res){
          if(res.data.success == 1){
            wx.showToast({
              title:'申请成功，系统将在1-2个工作日完成审核',
              icon:'none'
            })
          }else{
            wx.showToast({
              title:res.data.errorMessage,
              icon:'none'
            })
          } 
        }
      })
    } else if (app.globalData.mLevel == 2){
      wx.showToast({
        title:'您已是小掌柜',
        icon:'none'
      })
    } else if (app.globalData.mLevel == 3){
      console.log(3)
      wx.showToast({
        title:'您已是大掌柜',
        icon:'none'
      })
    }
  },

 
  /**
   * 生命周期函数--监听页面
   * 
   * 加载
   */
  onLoad: function (options) {
    this.setData({
      // memberLevel:app.globalData.mLevel,
    })
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