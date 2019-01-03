const App = getApp();
const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activities: [],//内部循环
    photograph:'',//图片
    sid:'',//商品id
    caption:'',//标题栏
    specification:'',//内容说明
    pictogram:'',//小图片
    site: '',//外网地址
    createTime:'',//时间
    actList: []//外面循环
   
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
      method: 'getArticleGroupList',
    }
    var total ='';
    //获取系统当前时间
    //获取当前时间
    var currentDates = new Date();
    var currentDate = currentDates.getTime();
    currentDates.getYear(); //获取当前年份(2位)
    currentDates.getMonth(); //获取当前月份(0-11,0代表1月)
    currentDates.getDate(); //获取当前日(1-31)
    currentDates.getHours(); //获取当前小时数(0-23)
    currentDates.getMinutes(); //获取当前分钟数(0-59)
    currentDates.getSeconds(); //获取当前秒数(0-59)
    var Month = currentDates.getMonth() + 1;
    var date = currentDates.getDate();
    var miao = currentDates.getHours() * 3600 + currentDates.getMinutes() * 60 + currentDates.getSeconds();

    api.reqData({
      data: data,
      success: function (res) {
      //  console.log(res)
        var activitiesList = res.data.result.rs[0].result;

        if (activitiesList.length != 0){
          var timeList = [];
          for (var i = 0; i < activitiesList.length; i++) {
          
            var num = activitiesList[i].edit_time;     //拼接时间
            var str = "20" + num
            var str1 = str.substr(0, 4) //年
            var str2 = str.substr(4, 2) //月
            var str3 = str.substr(6, 2) //日
            var str4 = str.substr(8, 2) //时
            var str5 = str.substr(10, 2) //分
            var str6 = str.substr(12, 2) //秒
            // var total = str1 + '-' + str2 + '-' + str3 + ' ' + str4 + ':' + str5 + ':' + str6
            if ((Month != str2 && date != str3) || (Month == str2 && date != str3)){//
              // console.log((Month != str2 && date != str3) || (Month == str2 && date != str3),'ss')
              total = str1 + '-' + str2 + '-' + str3;

            } else {
               total = str4 + ':' + str5;
            }
            timeList.push(total)
          }
          timeList.forEach(function (item, index) {
            activitiesList[index].edit_time = item        //将接口里的时间参数替换成需要的格式
          })

       }
        that.setData({
          actList: activitiesList,//外面循环

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