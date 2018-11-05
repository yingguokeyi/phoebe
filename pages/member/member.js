const api = require('../../utils/api.js');
const app = getApp();

// pages/member/member.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    goodList: [],             //非会员商品列表
    invitecode:'',              //邀请码
    invitecodehide:"",          //隐藏后的
    iseyes:0,                   //邀请码是否可见
    eyesno:"../../image/eyes1.png",
    eyescan: "../../image/eyes2.png",
    canPutForward:'',  //可提现金额
    cashBack:'',  //返现
    commission:'',     //佣金
    orderAmount:'',   //订单金额
    orderNum:'',      //订单量
    preMonthMoney:'',    // 预估本月收入
    preTodayMoney:'',    //预估今日收入
    putForward:'',       //提现
    totalIncome:'',       //累计效益      
    totalPreIncome:'',   //预计可提现金额
    zdzMoney:''        //回填单累计收益
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    // this.isMember()
    this.getCode()
    this.getmember()
  },

  //判断是否是会员
  // isMember() {
  //   var memberLevel = app.globalData.memberLevel
  //   console.log(memberLevel);
  //   this.setData({
  //     memberLevel: app.globalData.memberLevel
  //   })
  //   if (memberLevel == 1){
  //     this.getCode()
  //     this.getmember()
  //   } else if (memberLevel == 0){
  //     this.getCode()
  //     this.getGiftlist();
  //     this.getmember()
  //   }
  // },

  // 跳转点击量页面
  clickcount:function(){
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000
    })
    // wx.navigateTo({
    //   url: '/pages/member/clickCount/clickCount',
    // })
  },

  //跳转订单量页面
  ordercount:function(){
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000
    })
    // wx.navigateTo({
    //   url: '/pages/member/orderCount/orderCount',
    // })
  },
  //跳转全部收入数据
  getearnings: function () {
    // wx.showToast({
    //   title: '暂未开放',
    //   icon: 'none',
    //   duration: 2000
    // })
   
    wx.navigateTo({
      url: 'incomeData/incomeData',
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
  //跳转今日预估收益
  totalearn_today : function(){
    wx.navigateTo({
      url: '/pages/member/totalearn-order/totalearn-order?todayCommission=' + this.data.todayCommission,
    }) 
  },

  //跳转累计预估收益
  totalearn: function () {
    wx.navigateTo({
      url: '/pages/member/totalearn-order/totalearn-order?commission=' + this.data.commission,
    })
  },

        
  totalearn_no: function () {
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000
    })
  },
  //跳转账户余额
  tixian: function () {
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000
    })
    // wx.navigateTo({
    //   url: '/pages/member/balance/balance',
    // })
  },


  //跳转提现
  tqcash: function () {
    if (app.globalData.hasLogin == false) {
      wx.navigateTo({
        url:'/pages/login/login'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/mine/wallet/wallet',
    })
  },
 //跳转累计收益页面
  accimIncome : function(){
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000
    })
    // wx.navigateTo({
    //   url: '/pages/member/accum-income/accum-income',
    // })
  },
//跳转商品列表赚佣金
  toitemlist : function(){
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 2000
    })
  },

//得到会员信息
  getmember(){
    var that = this;
    let data = {
      method: 'findMyself',
      token: app.globalData.Apptoken,
      url_type: 'myself'
    }
    api.reqData({
        data,
        success: function(res) {
        var requestData = res.data.result.rs[0].result.result.rs;
        if(res.data.success == 1){
          if(requestData.length != 0){
            that.setData({
              canPutForward : requestData[0].money,   //可提现金额
              // cashBack : requestData.cashBack,
              // commission : requestData.commission,
              // orderAmount : requestData.orderAmount,
              // orderNum : requestData.orderNum,
              // preMonthMoney : requestData.preMonthMoney,
              // preTodayMoney : requestData.preTodayMoney,
              // putForward : requestData.putForward,
              totalIncome : requestData[0].totalIncome,
              totalPreIncome : requestData[0].totalPreIncome,      //预计可提现金额 
              zdzMoney:requestData[0].zdz_money    //回填单累计收益
            })
          }else{
            that.setData({
              canPutForward:0,
              totalPreIncome:0,
              zdzMoney:0
            })
          } 
        }
      }
    })
  },




//获取非会员商品列表
  getGiftlist() {
    let data = {
      method: 'findGiftGoodList',
      begin: 1,
      end: 10,
      url_type: 'myself'
    }

    api.reqData({
      data,
      success: (res) => {  
        let goodList = res.data.result.rs[0].searchGiftGoods.result.rs
        this.setData({
          goodList: goodList
        })
      }
    })
  },

//购买商品去提交订单成为会员
  tosubmitorder: function (e) {

    const sku_id = e.currentTarget.dataset.id
    const spu_id = e.currentTarget.dataset.ids
    const source = e.currentTarget.dataset.source
    const name = e.currentTarget.dataset.name
    const img = e.currentTarget.dataset.img
    const price = e.currentTarget.dataset.price
    const spu_attribute = e.currentTarget.dataset.attribute
    
    //不能按照路径控制权限特在此机动检验权限
    var hasLogin = app.globalData.hasLogin 
    if (!hasLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }else{
      wx.navigateTo({
        url: '/pages/buy/submitOrder/submitOrder?sku_id=' + sku_id + '&source=' + source + '&name=' + name + '&img=' + img + '&price=' + price + '&spu_id=' + spu_id + '&spu_attribute=' + spu_attribute,
      })
    }
  },

//得到邀请码
  getCode() {
    let data = {
      method: 'inviteFriends',
      token: app.globalData.Apptoken,
      url_type: 'myself'
    }
    api.reqData({
      data,
      success: (res) => {
        if (res.data.success==1){
        var tel = res.data.result.rs[0].inviteCode[0].InvitationCode
        this.setData({
          invitecode: tel,
          invitecodehide: tel.substr(0, 3) + '****' + tel.substr(7)
        })
      }
      },
    })
  },
//显示手机号
  toblock:function(){
    if (this.data.iseyes == 0){
      this.setData({
        iseyes:1
      })
    }else{
      this.setData({
        iseyes:0
      })
    }
  },


// 分享功能
  onShareAppMessage: function (res) {
    console.log(res);
    //转发设withShareTicket为true,可以二次转发
    wx.showShareMenu({
      withShareTicket: true
    })

    if (res.from === 'menu') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    // var pages = getCurrentPages() //获取加载的页面
    // var currentPage = pages[pages.length - 1] //获取当前页面的对象
    // var url = currentPage.route

    //var desc = "领有惠实惠商品";
    var title = '分享邀请人可以有奖金哦'
    return {  
      title: title,
      path:'/pages/member/share/share',
      success: function (res) {
        // 转发成功
        console.log(res)
        var shareTickets = res.shareTickets
        if (shareTickets) {
          if (shareTickets.length == 0) {
            return false;
          }
          wx.getShareInfo({        
            shareTicket: shareTickets[0],
            success: function (res) {
              var encryptedData = res.encryptedData;
              var iv = res.iv;
            }
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    }
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
  // this.isMember() 
  this.getCode()
  this.getmember()                  //调取判断是否是会员方法
  //获取头像
  if (app.globalData.userInfo) {
    this.setData({
      userInfo:app.globalData.userInfo,
      // hasUserInfo: true
    })
  } else {
    // 在没有 open-type=getUserInfo 版本的兼容处理
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          // hasUserInfo: true
        })
      }
    })
  }  
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