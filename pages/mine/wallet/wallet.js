
const api = require('../../../utils/api.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     walletlist:"",
     balance:'',   //可提现金额 
    totalIncome: '',       //累计效益  
    totalPreIncome: '',   //预计可提现金额
    zdzMoney: ''        //回填单累计收益
  },



//跳转到提现记录

  toprmoney :function(){
    // wx.showToast({
    //   title:'暂未开放',
    //   icon:'none'
    // })
    // return ;
    wx.navigateTo({
      url: '/pages/mine/wallet/prmoney/prmoney',
    })
  },

  //跳转充值页面
  toRecharge : function(){
    wx.navigateTo({
      url: '/pages/mine/wallet/Recharge/Recharge',
    })
  },
  //跳转提现页面
  togetbalance : function(){   
    wx.navigateTo({
      url: '/pages/member/tqcash/tqcash?balance='+this.data.balance,
    })
  },
  //跳转全部收入数据
  getearnings: function () {
    wx.navigateTo({
      url: '/pages/member/incomeData/incomeData',
    })

  },
  //未开放
  unopened: function () {
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000
    })

  },
  //跳转入账记录页面
  accounting: function () {
    // wx.showToast({
    //   title: '暂未开放',
    //   icon: 'none',
    //   duration: 2000
    // })
    wx.navigateTo({
      url: '/pages/mine/wallet/accountingRecords/accountingRecords',
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getmember()                  //调取判断是否是会员方法
   
   
  },

  
  //得到会员信息
  // getmember(){
  //   var that = this;
  //   let data = {
  //     method: 'findMyself',
  //     token: app.globalData.Apptoken,
  //     url_type: 'myself'
  //   }
  //   api.reqData({
  //     data,
  //     success: function(res) {
  //       var requestData = res.data.result.rs[0].result.result.rs;
  //       if(res.data.success == 1){
  //         if(requestData.length != 0){
  //           that.setData({
  //             balance : requestData[0].money,   //可提现金额
  //           })
  //         }else{
  //           that.setData({
  //             balance:0,
  //           })
  //         } 
  //       }
  //     }
  //   })
  // },
  //得到会员信息
  getmember() {
    var that = this;
    let data = {
      method: 'findMyself',
      token: app.globalData.Apptoken,
      url_type: 'myself'
    }
    api.reqData({
      data,
      success: function (res) {
        var requestData = res.data.result.rs[0].result.result.rs;
        if (res.data.success == 1) {
          if (requestData.length != 0) {
            that.setData({
              balance: requestData[0].money,   //可提现金额
              // cashBack : requestData.cashBack,
              // commission : requestData.commission,
              // orderAmount : requestData.orderAmount,
              // orderNum : requestData.orderNum,
              // preMonthMoney : requestData.preMonthMoney,
              // preTodayMoney : requestData.preTodayMoney,
              // putForward : requestData.putForward,
              totalIncome: requestData[0].totalIncome,
              totalPreIncome: requestData[0].totalPreIncome,      //预计可提现金额 
              zdzMoney: requestData[0].zdz_money    //回填单累计收益
            })
          } else {
            that.setData({
              balance: 0,
              totalPreIncome: 0,
              zdzMoney: 0
            })
          }
        }
      }
    })
  },
  //跳转提现
  tqcash: function () {
    if (app.globalData.hasLogin == false) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/mine/wallet/wallet',
    })
  },
//调用我的钱包接口

  getwallet(){
    let data={
      method:'Mywallet',
      token: app.globalData.Apptoken,
      nowMonth:1801,
      url_type: 'myself'
    }
    api.reqData({
        data,
        success: (res) => {
          console.log("++++++++++++++++++++++++++++++++++我的钱包")
          console.log(res.data.result.rs[0].wallet)
          var walletlist = res.data.result.rs[0].wallet

          //转化时间
          var timeList = []
          for (var i = 0; i < walletlist.length; i++) {
            var num = walletlist[i].operation_time     //拼接时间

            var str = "20" + num

            var str1 = str.substr(0, 4)

            var str2 = str.substr(4, 2)

            var str3 = str.substr(6, 2)

            var str4 = str.substr(8, 2)

            var str5 = str.substr(10, 2)

            var total = str1 + '-' + str2 + '-' + str3 + ' ' + str4 + ':' + str5 

            timeList.push(total)

          }
      
          timeList.forEach(function (item, index) {
            walletlist[index].operation_time = item        //将接口里的时间参数替换成需要的格式
          })
      
          console.log(walletlist)
          var balance = res.data.result.rs[1].balance[0].balance
          this.setData({
            balance:balance,
            walletlist: walletlist
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
    this.getmember()
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