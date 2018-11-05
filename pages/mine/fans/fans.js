// pages/mine/fans/fans.js
const app = getApp()
const api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex:1, 
    fanList:[], 
    allFan:'',
    simpleNum:'',
    smallNum:'',
    bigNum:'',
  },

  changeTab:function(e){
    this.setData({
      tabIndex:e.currentTarget.dataset.id,
    })
    this.getFanList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      tabIndex:options.type
    })
    this.getFanList();
  },

  getFanList:function(){
    let that = this;
    let data = {
      method: 'getMyFans',
      token: app.globalData.Apptoken,
      url_type: 'myself',
      memberLevel:that.data.tabIndex
    }
    api.reqData({
      data,
      success: (res) => {
        
        console.log(res)
       
        let result = res.data.result.rs;
        let resultLen = result[0].result.result.rs;
        var timeList = [];
        for(var i = 0 ; i < resultLen.length ; i++){
          var num = resultLen[i].beInvite_date     //拼接时间
          var str = "20" + num
          var str1 = str.substr(0, 4)
          var str2 = str.substr(4, 2)
          var str3 = str.substr(6, 2)
          var str4 = str.substr(8, 2)
          var str5 = str.substr(10, 2)
          var str6 = str.substr(12, 2)
          var total = str1 + '-' + str2 + '-' + str3 + ' ' + str4 + ':' + str5 
          timeList.push(total);
          resultLen[i].nick_name = resultLen[i].nick_name.substr(0,3)+'****'+resultLen[i].nick_name.substr(7)
        }
        timeList.forEach(function (item, index) {
          resultLen[index].beInvite_date = item        //将接口里的时间参数替换成需要的格式
        })
        

       that.setData({
         allFan:result[1].count.result.rs[0].levelAll,
         simpleNum:result[1].count.result.rs[0].levelA,
         smallNum:result[1].count.result.rs[0].levelB,
         bigNum:result[1].count.result.rs[0].levelC,
         fanList:resultLen
       })
      },
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