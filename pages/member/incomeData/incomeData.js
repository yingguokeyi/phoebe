// pages/member/myearnings/myearnings.js
// var util = require('../../../components / date - picker / date - pickerrequire');
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
    detail:'',
    timetable:'',
    result:[],
    disp:"",//接口中获得月份和时间
    sumo:'',//接口中获得的收益
    bill:'',//接口中获得的单数
    day_money:'',
    day_time:'',
    day_count:'',
    str:'',
    page: 1,
    showView: true,//判断文字是否显示
    showDetails: false,//判断数据有的话不显示
    noData:'',
    complete: ''//下拉刷新接口调用结束的回调函数（调用成功、失败都会执行）

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    //获取当前时间
    var myDate = new Date();
    myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    myDate.getMonth();       //获取当前月份(0-11,0代表1月)
    var age = myDate.getFullYear();
    var moon = myDate.getMonth() + 1;
    this.setData({
      date: `${age}年${moon < 10 ? '0' + moon : '' + moon}月`, 
    })

    that.getAggregation()
    
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
 
  // 调取全部收入数据的接口
  getAggregation: function(){

    let data = {
      method: 'getMonthPddCommission',
      token: app.globalData.Apptoken,
      url_type: 'order'
    }
    api.reqData({
      data,
      success: (res) => {
        var resultRes = res.data.result.rs[0].result.result.rs;  
         console.log(resultRes)
        if (resultRes != '') {    //如果返回有数据
          this.setData({
            result: resultRes,
            showView: false,
            showDetails: false, 
          })
        } else {   //没有返回的数据 
           this.setData({
             result: resultRes ,
          })
           this.setData({
             showView: false,
             showDetails: true,
           })
        }
     
      },
      fail: function () {
      },
    })
  },
//下拉刷新显示提示语
  onPullDownRefresh: function () {
    this.setData({
      showView: true,
    })
    setTimeout(() => {
      this.setData({
        showView: false,
      })
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000) 
  },
  
//点击事件
  daily:function(e){
    let time = e.currentTarget.dataset.time;
    let money = e.currentTarget.dataset.money;
    let count = e.currentTarget.dataset.count;
    wx.navigateTo({
      url: '/pages/member/dailyData/dailyData?disp=' + time + '&wallet=' + money + '&count=' + count,
    })
  },
  // 点击去赚钱跳转到首页
  boxx: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
    // 日期插件
  showDatePicker: function (e) {
    this.setData({
      datePickerIsShow: true,
    });
  },
// 确定按钮
  datePickerOnSureClick: function (e) {
    console.log(e)
    console.log("date")
    console.log('datePickerOnSureClick');
    this.setData({
      date: `${e.detail.value[0]}年${e.detail.value[1]}月`,
      datePickerValue: e.detail.value,
      datePickerIsShow: false,
    });
    this.getAggregation()
  },
// 取消按钮
  datePickerOnCancelClick: function (event) {
    console.log('datePickerOnCancelClick');
    console.log(event);
    this.setData({
      datePickerIsShow: false,
    });
  },
 
})