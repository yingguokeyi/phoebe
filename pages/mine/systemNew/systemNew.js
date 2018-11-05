// pages/mine/newsList/newsList.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    hasNew:true,
    newType:''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type == 'XT'){
      wx.setNavigationBarTitle({
        title: '系统通知'
      })
    }else if(options.type == 'YH'){
      wx.setNavigationBarTitle({
        title: '优惠活动'
      })
    }
    this.setData({
      newType:options.type
    })
    this.getNew();
  },

  goLink:function(e){
    let index = e.currentTarget.dataset.link;
    wx.navigateTo({
      url:"/pages/common/common?"+index
    })
  },
  getNew:function(){
    let that = this;
    let data = {
      method:'getMemberMessagesInfo',
      url_type:'member',
      memberLevel:app.globalData.mLevel,
      messageSign:that.data.newType,
    }
    api.reqData({
      data,
      success:function(res){
        let lengthnum = res.data.result.rs;
        console.log(lengthnum.length)
        if(lengthnum.length != 0){
          var timeList = [];
          for (var i = 0; i < lengthnum.length; i++) {
            var num = lengthnum[i].publish_time;     //拼接时间
            var str = "20" + num
            var str1 = str.substr(0, 4)  
            var str2 = str.substr(4, 2)
            var str3 = str.substr(6, 2)
            var str4 = str.substr(8, 2)
            var str5 = str.substr(10, 2)
            var str6 = str.substr(12, 2)
            var total = str1 + '-' + str2 + '-' + str3 + ' ' + str4 + ':' + str5 + ':' + str6
            timeList.push(total)  
          }
          timeList.forEach(function (item, index) {
            lengthnum[index].publish_time = item        //将接口里的时间参数替换成需要的格式
          })
          that.setData({
            list:lengthnum
          })
        }else if(lengthnum.length == 0){
          that.setData({
            hasNew:false
          })
        }
      }
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