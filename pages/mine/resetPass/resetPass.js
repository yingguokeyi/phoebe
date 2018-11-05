// pages/mine/resetPass/resetPass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    finishDisabled:true,   //完成按钮的使用
    finishBtnColor:'#b3b3b3',  //完成按钮的字体颜色
    finishBtnBgColor:'#ebebeb',  //完成按钮的背景
    oldPass:'',
    newPass:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  oldValue:function(e){
    var that = this;
    if(e.detail.value == ""){
      wx.showToast({
        title:'请输入现在的密码',
        icon:'none'
      })
    }
    that.setData({
      oldPass:e.detail.value
    })
  },

  newValue:function(e){  
    var that = this;
    console.log(e)
    if(e.detail.value == ""){
      wx.showToast({
        title:'请输入新的密码',
        icon:'none'
      })
    }else{
      if(e.detail.value.length < 6 || e.detail.value.length > 20){
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '密码长度为6-20位字符'
        });
      }
      that.setData({
        newPass:e.detail.value
      })
    }
  },
  valuing:function(e){
    // if(this.data.oldPass){
      if(this.data.oldPass && e.detail.value.length > 0){
      console.log(this.data.oldPass)
        this.setData({
          finishDisabled:false,
          finishBtnColor:'#fff',
          finishBtnBgColor:'#b61c25'
        })
      }else{
        this.setData({
          finishDisabled:true,
          finishBtnColor:'#b3b3b3',
          finishBtnBgColor:'#ebebeb'
        })
      }
    // } 
  },

  oldvaluing:function(e){
    if(this.data.newPass && e.detail.value.length > 0){
      this.setData({
        finishDisabled:false,
        finishBtnColor:'#fff',
        finishBtnBgColor:'#b61c25'
      })
    }else{
      this.setData({
        finishDisabled:true,
        finishBtnColor:'#b3b3b3',
        finishBtnBgColor:'#ebebeb'
      })
    }
  },

  onLoad: function (options) {
  
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