// pages/mine/memberLevel/memberLevel.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     memberType:'',      //判断当前用户的等级 1是普通会员 2是小掌柜 3是大掌柜
     tabIndex:1,     //切换会员等级的下标
     tabs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */

  memberLevel:function(){
    if(this.data.tabIndex == 1){
      this.setData({    //普通会员
        tabs:[
          {
            name: "普通会员",
            imgUrl: "../../../image/person/ptpoint.png",
          },
          {
            name: "小掌柜",
            imgUrl: "../../../image/person/xzgnopoint.png"
          },
          {
            name: "大掌柜",
            imgUrl: "../../../image/person/dzhnopoint.png"
          }
        ]
      })
    }else if(this.data.tabIndex == 2){
      this.setData({
        tabs:[
          {
            name: "普通会员",
            imgUrl: "../../../image/person/ptnopoint.png"
          },
          {
            name: "小掌柜",
            imgUrl: "../../../image/person/xzgpoint.png"
          },
          {
            name: "大掌柜",
            imgUrl: "../../../image/person/dzhnopoint.png"
          }
        ]
      })
    }else if(this.data.tabIndex == 3){
       this.setData({
        tabs:[
          {
            name: "普通会员",
            imgUrl: "../../../image/person/ptnopoint.png"
          },
          {
            name: "小掌柜",
            imgUrl: "../../../image/person/xzgnopoint.png"
          },
          {
            name: "大掌柜",
            imgUrl: "../../../image/person/dzhpoint.png"
          }
        ]
      })
    }
  },

  currentLevel:function(e){
    this.setData({
      tabIndex:e.currentTarget.dataset.index,
    })
    this.memberLevel();
  },
  // 联系客服
  tellService : function(){
    wx.showModal({
      title: '提示',
      content: '400-0000-0000',
      showCancel:false
    })
  },

  apply:function(){
    wx.navigateTo({
      url:'/pages/mine/partner/partner'
    })
  },

  onLoad: function (options) {
    this.setData({
      memberType : app.globalData.mLevel,
      tabIndex:app.globalData.mLevel,
    })
    this.memberLevel();
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