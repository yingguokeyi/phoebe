const App = getApp();
const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activities: [],
    photograph:'',//图片
    sid:'',//商品id
    caption:'',//标题栏
    specification:'',//内容说明
    pictogram:'',//小图片
    site: '',//外网地址
    createTime:''//时间
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  
  },
// 获取内容
  acquisitionActivities:function(e){
    let that = this;
    let data = {
      url_type: 'myself',
      method: 'getArticleList',
    }
    api.reqData({
      data: data,
      success: function (res) {
        // console.log(res,'活动')
        var activitiesGood = res.data.result.rs[0].result.result.rs;
        if (activitiesGood.length != 0){
          var timeList = [];
          for (var i = 0; i < activitiesGood.length; i++) {
            var num = activitiesGood[i].edit_time;     //拼接时间
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
            activitiesGood[index].edit_time = item        //将接口里的时间参数替换成需要的格式
          })

      }
        that.setData({
          activities: activitiesGood,
        })
      }
    })

  },
  goLink: function (e) {
    let uri = e.currentTarget.dataset.uri;
    if ( uri.substr(0,3)=='www'){
      var ent = encodeURIComponent('https://' + uri) 
      wx.navigateTo({
        url: '/pages/index/vacancy/vacancy?site=' + ent,
      })

    }else{
      //跳到活动页面
      var ent = encodeURIComponent(uri) 
      wx.navigateTo({
        url: '/pages/index/vacancy/vacancy?site=' + ent,
        })

    }
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.acquisitionActivities();

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