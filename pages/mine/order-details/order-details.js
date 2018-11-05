const api = require('../../../utils/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
   statuscode:"",
   ordercode:"",
   orderdate:"",
   price:'',
   image:"",
   name:"",
   gift:'',
   desc:'',
   buyer:'',
   phone:'',
   address:'',
   backMoney:''
  },

  getDeliveryMsg() {
    const self = this;
    let data = {
      method: 'getAddress',
      token: app.globalData.Apptoken,
      url_type: 'index',
    }

    api.reqData({
      data,
      success: (res) => {
        //这个得写法和格式 setData({........})
        console.log(res)
        self.setData({
          deliveryMsg: res.data.result.rs[0],
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      statuscode:options.statuscode,
      ordercode: options.ordercode,
      orderdate: options.orderdate,
      price: options.price,
      image: options.image,
      name:options.name,
      gift:options.gift,
      desc:options.desc,
      buyer:options.buyer,
      phone:options.phone,
      address:options.address,
      backMoney:options.backMoney
    })
  },

  copy:function(){
    wx.setClipboardData({
      data: this.data.ordercode,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDeliveryMsg();
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