const wxbarcode = require('../../../../utils/index.js');
const util = require('../../../../utils/util.js');
const api = require('../../../../utils/api.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    datePickerValue: ['', '', ''],
    datePickerIsShow: false,
    showDetails: false,//判断数据有的话不显示
    detail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取当前时间
    var myDate = new Date();
    myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    myDate.getMonth();       //获取当前月份(0-11,0代表1月)
    // console.log(myDate.getFullYear())
    // console.log(myDate.getMonth()+1)
    var age = myDate.getFullYear();
    var moon = myDate.getMonth() + 1;
    this.setData({
      date: `${age}年${moon}月`,
    })
    that.accountingRecords()
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
  /**
   * 请求接口
   */
  accountingRecords: function () {
      let data={
        method:'getAccountRecordZDZ',
        token: app.globalData.Apptoken,
        url_type: 'myself'
      }
      api.reqData({
        data,
        success: (res) => {
          // console.log(res);
          var resultList = res.data.result.rs[0].result.result.rs;
          // console.log(resultList)
          resultList = util.formatTimeStyle(resultList)
          resultList = util.formatTm(resultList)
          if (resultList !=''){   //判断有数据的时候
            this.setData({
              result: resultList,
            })
            // console.log(this.data.result) 
            for (var i = 0; i < resultList.length;i++){
              var information = resultList[i];
              // console.log(information)
              var values = [];
              for (var a in information) {
                values.push(information[a])
              }
              // console.log(values[1])
            }
           this.setData({
              showDetails: false,
            })
          }else{
            this.setData({
              result: resultList,
            })
            this.setData({
              showDetails: true,
            })
          }
        },
        fail: function () {
        },
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
    // console.log(e);
    this.setData({
      datePickerIsShow: true,
    });
  },
  // 确定按钮
  datePickerOnSureClick: function (e) {
    console.log(e)
    console.log(e.detail.value)
    console.log('datePickerOnSureClick');
    this.setData({
      date: `${e.detail.value[0]}年${e.detail.value[1]}月`,
      datePickerValue: e.detail.value,
      datePickerIsShow: false,
    });
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