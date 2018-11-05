// pages/index/newsPublish/newsPublish.js
const app = getApp();
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:'',            //用户定位城市
    isShowPic:false,    //是否已经选择图片显示图片列表
    picList:[],         //图片列表
    isCanPub:false,     //是否可以提交
    pubBack:'#ebebeb',  //发布按钮的背景颜色
    pubColor:'#fff',    //发布按钮的字体颜色
    pubContent:'',      //发布的内容
  },

  /**
   * 生命周期函数--监听页面加载
   */

  getCity:function(){
    var loc = app.globalData.locationInfo;
    console.log(loc)
    const data = {
      ak: app.globalData.ak,
      location: loc.latitude + "," + loc.longitude,
      output: 'json',
      coordtype: 'wgs84'
    }
    var self = this
    api.getAddressByLocation({
      data,
      success: (res) => {
        if (res.data.status != '220') {
          self.setData({
            city: res.data.result.addressComponent.city,

          })
          app.globalData.city = res.data.result.addressComponent.city
        }
      }
    })   
  },

   //跳转选择城市
  Location: function () {
    console.log(this.data.city)
    wx.navigateTo({
      url: "/pages/index/switchcity/switchcity?city=" + this.data.city
    })
  },

  addPic:function(){    //添加图片
    var that = this;
    wx.chooseImage({
      count: 4, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],      // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        that.setData({
          picList:tempFilePaths,
          isShowPic:true
        })
      }
    })
  },

  getCon:function(e){
    let that = this;
    console.log(e.detail.value)   
    if(e.detail.value.length > 0){
      that.setData({
        pubContent:e.detail.value,
        isCanPub:true,
        pubColor:'#fff',
        pubBack:'#b61c25',
        isCanPub:true
      })
    }else{
      that.setData({
        isCanPub:false,   //是否可以提交
        pubBack:'#ebebeb',  //发布按钮的背景颜色
        pubColor:'#fff',  //发布按钮的字体颜色
        pubContent:'',    //发布的内容
      })
    }
  },

  goSub:function(){
    let that = this;
    if(!that.data.city){
      wx.showToast({
        title:'请选择定位',
        icon:'none'
      })
      return ;
    }
  },

  onLoad: function (options) {
    if(this.data.city != ''){
      this.setData({
        city:App.globalData.city
      })
    }else{
      this.getCity()
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
    if(app.globalData.city){
      this.setData({
        city:app.globalData.city
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