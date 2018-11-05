const wxbarcode = require('../../../../utils/index.js');
const api = require('../../../../utils/api.js');
const util = require('../../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    datePickerValue: ['', '', ''],
    datePickerIsShow: false,
    detail: [],
    isHasRecord:false
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
    that.setData({
      date: `${age}年${moon < 10 ? '0' + moon : '' + moon}月`,
    })
    that.getRecord()
  },

  getRecord:function(){
    var that = this;
    let date = that.data.date;
    var reg = /[\u4e00-\u9fa5]/g;    
    date = date.substring(2).replace(reg, "");  
    let data = {
      method: 'getWithdrawRecord',
      token: app.globalData.Apptoken,
      url_type: 'member',
      // month_time:''  //暂时不传，取到全部
    }
    api.reqData({
      data,
      success: function(res) {
        console.log(res.data.result.rs)
        if(res.data.success == 1){
          if(res.data.result.rs.length != 0){
            var record = res.data.result.rs  
            record = util.formatTimeStyle(record)
            for(var i = 0 ; i< record.length ; i ++){
              if(record[i].err_code_des.indexOf('非实名')  != -1){   //有实名两个字
                record[i].err_code_des="温馨提示 : 因为您提现的微信未实名认证，导致我们无法为您打款，建议进行实名认证之后重新提现"
              }
            }
            that.setData({
              isHasRecord:true,
              detail:record
            })
            console.log(typeof(that.data.detail))
          }else{
            that.setData({
              isHasRecord:false
            })
          }
        }
      }
    })
  },

  boxx: function () {
    wx.switchTab({
      url: '/pages/index/index',
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
  
  },
  // 日期插件
  showDatePicker: function (e) {
    // console.log(e);
    // this.data.datePicker.show(this);
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
    this.getRecord()
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