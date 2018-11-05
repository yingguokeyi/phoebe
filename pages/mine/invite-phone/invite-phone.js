const app = getApp()
const api = require('../../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobile:'',
    parentUserHasMark: '',
    inviteTel:'',
    userInput:'',
    isSave:false,
    saveBtn:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData.parentUserHasMark);  //1
    that.setData({
      parentUserHasMark:app.globalData.parentUserHasMark
    })
    if(app.globalData.parentUserHasMark==1){
      that.getphone();
    }   
  },
   //获取手机号
   getphone() {
    let data = {
      method: 'findSupmember',
      token: app.globalData.Apptoken,
      url_type: 'myself'
    }
    api.reqData({
      data,
      success: (res) => {
        if (res.data.success==1){
          console.log(res.data.result.rs[0].phone)
          let tel = res.data.result.rs[0].phone;
          this.setData({
            inviteTel:res.data.result.rs[0].phone.substr(0, 3) + '****' + res.data.result.rs[0].phone.substr(7),
          })
          // 设置上一个页面的邀请人手机号
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1]; //当前页面
          var prevPage = pages[pages.length - 2]; //上一个页面        
           //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
               inviteTel:res.data.result.rs[0].phone.substr(0, 3) + '****' + res.data.result.rs[0].phone.substr(7),
          })
        }else{
          console.log(res)
        }        
      },
    })
  },

  mobile: function (e) {
    this.setData({
      mobile: e.detail.value,
    }) 
  },
  mobileTest:function(e){
    var reg = /^[1][0-9]{10}$/;
    if (!reg.test(e.detail.value)) {
      wx.showToast({
        title:'请填写正确的手机号码',
        icon:'none'
      })
    } 
  },

//保存成功后跳转
  svaecode : function(){
    var that = this;
    if(that.data.mobile == ''){
      wx.showToast({
        title:'请填写手机号码',
        icon:'none'
      })
      return false;
    }else if(that.data.mobile != ''){
      var reg = /^[1][0-9]{10}$/;
      if (!reg.test(that.data.mobile)) {
        wx.showToast({
          title:'请填写正确的手机号码',
          icon:'none'
        })
        return false; 
      } 
    }
   that.setData({
     isSave:true
   })
    let data = {
      method: 'confirmSupmember',
      token: app.globalData.Apptoken,
      phone: this.data.mobile,
      url_type: 'myself'
    }
    api.reqData({
      data,
      success: (res) => {
        if(res.data.success == 1){
          console.log(data);
            that.setData({
              parentUserHasMark: 1
          })
          app.globalData.parentUserHasMark = 1
          wx.showToast({
            title: '绑定成功',
          })
          that.getphone()
        }else{
          wx.showToast({
            title: res.data.errorMessage,
            icon:'none',
            success:function(res){
              that.setData({
                mobile:'',
                isSave:false
              })
            }
          })
          return false
        }
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
  onShow: function (options) {
   
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

//填写邀请人信息
  


})