// pages/member/myearnings/myearnings.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    datePickerValue: ['', '', ''],
    datePickerIsShow: false,
    disp:'',
    money:'',
    count:'',
    phone:'',
    status:'',
    ensconcePhone:'',//隐藏后的电话号
    profit_source:'',//数据的来源
    t_name:'',//手机号
    create_time:'',//创建时间
    showDetails: false,//判断数据有的话不显示
    result: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      disp: options.disp,
      wallet: options.wallet,
      count: options.count,
    })
    // console.log(this.data.money)
    //从后台拿到时间是180711格式进行转化成18年07月11日
    var str = this.data.disp;
    var time = str.substring(0, 2) + "年" + str.substring(2, 4) + '月' + str.substring(4, 6) + '日';
    this.setData({
      time:time,
    })

    this.getDaily()
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
  // 点击去赚钱跳转到首页
  boxx: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  //调每日详细数据
  getDaily:function(){
    let that = this;
    let data = {
      method: 'getPddCommissionTest',
      token: app.globalData.Apptoken,
      dayTime: this.data.disp,
      url_type: 'order'
    }
    api.reqData({
      data,
      success: (res) => {
        var resultRes = res.data.result.rs[0].result.result.rs; 
        resultRes = util.acquisitionPhone(resultRes)
        if (resultRes !=''){   //有数据返回
          for(var i = 0 ; i < resultRes.length ; i ++ ){
            resultRes[i].order_create_time = util.acquisitionTime(resultRes[i].order_create_time)
          }
          that.setData({
            result: resultRes,
            showDetails: false,
          })       
        }else {
          that.setData({
            result: resultRes,
            showDetails: true,
          })
        }
      },
      fail: function () {
      },
    })
  }
  
})