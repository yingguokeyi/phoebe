const app = getApp()
const api = require('../../../utils/api.js')
const wxbarcode = require('../../../utils/index.js');
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
     invitecode:"",          //邀请码
     invitemes:[],             //邀请列表
     inviteTel:''
  },
//调取邀请好友接口
getinvite(){
  let data = {
    method: 'inviteFriends',
    token: app.globalData.Apptoken,
    url_type: 'myself'
  }
  api.reqData({
    data,
    success: (res) => {
      console.log(res.data)
      if(JSON.stringify(res.data.result.rs[1]) != '{}'){
        var orderlistRes = res.data.result.rs[1].OrderList;
        var timeList = []
        for (var i = 0; i < orderlistRes.length; i++) {
          var num = orderlistRes[i].beInvite_date     //拼接时间
          var str = "20" + num
          var str1 = str.substr(0, 4)
          var str2 = str.substr(4, 2)
          var str3 = str.substr(6, 2)
          var str4 = str.substr(8, 2)
          var str5 = str.substr(10, 2)
          var str6 = str.substr(12, 2)
          var total = str1 + '-' + str2 + '-' + str3 + ' ' + str4 + ':' + str5 
          timeList.push(total)
        }
        timeList.forEach(function (item, index) {
          orderlistRes[index].beInvite_date = item        //将接口里的时间参数替换成需要的格式
        })
      }
      this.setData({
        invitecode: res.data.result.rs[0].inviteCode[0].InvitationCode,
        invitemes: orderlistRes
      })
    },
  })
},


//判断是否有上级,有上级就onLoad里面调用这个函数，没有上级就触发点击事件goInvite
  changePhone:function(){
    var that = this;
    console.log(app.globalData.parentUserHasMark);
    if (app.globalData.parentUserHasMark == 1) {
      that.getphone();
    }
    return false;
  },
  goInvite:function(){
    wx.navigateTo({
      url: '../invite-phone/invite-phone',
    })
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
        if (res.data.success == 1) {
          console.log(res.data.result.rs[0].phone)
          let tel = res.data.result.rs[0].phone;
          this.setData({
            inviteTel: res.data.result.rs[0].phone.substr(0, 3) + '****' + res.data.result.rs[0].phone.substr(7),
          })
        } else {
          console.log(res)
        }
      },
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wxbarcode.qrcode('qrcode','15735166319', 320, 320);
    this.changePhone()
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
    this.getinvite()
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