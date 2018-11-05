const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '订单支付日期',
    startdate: '开始日期',
    enddate: '结束日期',
    startDate:'',
    endDate:'',
    List:[],                 //收益订单列表
    selfCommission:"",        //返现金额
    orderNo:''
  },

/**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    let beginDate = ""
    let overDate = ""
    if (this.data.todayCommission != '' && this.data.todayCommission != undefined) {
      let nowTime = util.formatTime(new Date())
      var str1 = nowTime.substr(2, 8)
      var str2 = str1.replace(/-/g, "");
      console.log(str2)
      beginDate = str2
      overDate = str2
    } else if (this.data.commission != '' && this.data.commission != undefined) {
      beginDate = this.data.startDate
      overDate = this.data.endDate
    }   

    this.setData({
      startDate: beginDate,
      endDate: overDate
    })
    this.look() 
  },



  //改变日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindDateChangea: function (e) {
    console.log('开始日期', e.detail.value)
    var str = e.detail.value
    var str1 = str.substr(2)
    var str2 = str1.replace(/-/g, "");
    this.setData({
      startdate: e.detail.value,
      startDate: str2
    })
  },
  bindDateChangeb: function (e) {
    console.log('结束日期', e.detail.value)
    var str = e.detail.value
    var str1 = str.substr(2)
    var str2 = str1.replace(/-/g, "");
    this.setData({
      enddate: e.detail.value,
      endDate:str2
    })
  },

  //获取取消订单备注
  orderNoInput: function (e) {
    this.setData({
      orderNo: e.detail.value
    })
  },

//获取页面数据
look:function(){ 
  let data = {
    method: 'getMemberProfitList',
    token: app.globalData.Apptoken,
    startDate: this.data.startDate,
    endDate: this.data.endDate,
    orderno: this.data.orderNo,
    begin:1,
    end:10,
    url_type: 'member'
  }

  api.reqData({
    data,
    success: (res) => {
      console.log(res)
      var resultList = res.data.result.rs[0].memberProfitList.result.rs

      var timeList = []
      for (var i = 0; i < resultList.length; i++) {
        var num = resultList[i].create_time     //拼接时间
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
        resultList[index].create_time = item        //将接口里的时间参数替换成需要的格式
      })

      this.setData({
        List: resultList
      })}
   })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        todayCommission: options.todayCommission,
        commission: options.commission
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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