// pages/mine/orderArea/orderArea.js

const App = getApp();
const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo:'',  // 订单号  
    selectGood:'',  //商品名字
    note:'',
    choosePic:'',  //选择的图片路径
    isChoose:false,  //是否已经选择图片
    imgType:'',   //图片类型
    skuid:'',    //选择商品的id
    isAuto:false,    //选择商品默认显示的
    subDisable:true,
    backColor:'#ebebeb',
    fontColor:'#b3b3b3',
    showSelect:true,  //是否显示选择的商品框
    showArea:false,   //显示隐藏备注的文本框
    goodsList:[],
    isShow:false,  //是否显示选择日期的picker
   
  },
  // 输入订单号的判断
  orderInput:function(e){
    if((this.data.selectGood && e.detail.value.length > 0) || this.data.isChoose == true ) {
      this.setData({
        subDisable:false,
        fontColor:'#fff',
        backColor:'#b61c25'
      })
    }else{
      this.setData({
        subDisable:true,
        fontColor:'#b3b3b3',
        backColor:'#ebebeb'
      })
    }
  },

  orderMove:function(e){
    var that = this;
    if(e.detail.value == ""){
      wx.showToast({
        title:'请输入订单号',
        icon:'none'
      })
    }else if(e.detail.value > 0 && e.detail.value < 18){//填写订单号不为空，正则判断18位数字
        wx.showToast({
          title:'请输入18位纯数字',
          icon:'none'
        })
    }else{
      that.setData({
        orderNo:e.detail.value
      })
    }
   
  },

  showSelect:function(){
    console.log('选择')
    if(this.data.isShow == true){   //true 点击不展现选项
      this.setData({
        showSelect:true,
        showArea:false,   //   
        isShow:false,
      })
    }else{
      this.setData({   //false 点击展现选项
        showSelect:false,
        showArea:true,   //弹出选项的时候让文本域隐藏，文本域的层级高
        isShow:true,
        subDisable:true,
        fontColor:'#b3b3b3',
        backColor:'#ebebeb'
      })
    }
    
  },

  upImg:function(){
    var that = this;
    wx.chooseImage({
        count: 1,   //最多可以选择的图片张数，默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          console.log(res)
          var pic = res.tempFilePaths[0];
          if(res.tempFiles[0].size > 2097152){
            wx.showToast({
              title:'图片太大，请处理',
              icon:'none'
            })
            return ;
          }
          
          wx.getImageInfo({   //判断图片的格式
            src: pic,
            success: function (res) {
              console.log(res.type)
              let imgType = res.type
              if(imgType == 'png' || imgType == 'bmp' || imgType=='jpeg' || imgType=='jpg'||imgType=='gif'){
                that.setData({
                  imgType:res.type,
                  choosePic:pic,
                  isChoose:true,
                  subDisable:false,
                  fontColor:'#fff',
                  backColor:'#b61c25'
                })
              }else{
                wx.showToast({
                  title:'上传图片格式错误',
                  icon:'none'
                })
                return ;
              }
            }
          })
          // wx.getSavedFileInfo({
          //   filePath: pic, 
          //   success: function(res) {
          //     console.log(res.size)
          //     if(res.size > 2097152){
          //       wx.showToast({
          //         title:'图片太大，请处理',
          //         icon:'none'
          //       })
          //       return ;
          //     }else{
          //       that.setData({
          //         choosePic:pic,
          //         isChoose:true,
          //         subDisable:false,
          //         fontColor:'#fff',
          //         backColor:'#b61c25'
          //       })
          //     }
          //   },
          //   fail:function(res){
          //     console.log(res)
          //   }
          // })
       }
    }) 
  },
 
  
  
  selectSure:function(e){
    let that = this;
    let good = e.currentTarget.dataset.con;
    let sku = e.currentTarget.dataset.sku;
    console.log(good)
    that.setData({
      showSelect:true,
      selectGood:good,
      showArea:false,
      isShow:false,
      skuid:sku,
      isAuto:true
    })
    if(that.data.orderNo || that.data.choosePic){
      that.setData({
        subDisable:false,
        fontColor:'#fff',
        backColor:'#b61c25'
      })
    }
  },

  // 获得商品名称
  getGoods:function(){
    var that = this;
    let data = {
      method:'getZhangDZGoods',
      url_type:'classify'
    }
    api.reqData({
      data,
      success:function(res){
        that.setData({
          goodsList:res.data.result.rs[0].zhangDZGoods.result.rs.reverse()
        })
      }
    })
  },

  noteSave:function(e){
    this.setData({
      note:e.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let that = this;
     that.getGoods();
  },

  // 提交
  goSubmit:function(){
    var that = this;
    if(that.data.orderNo){
      var orderReg=/[0-9]{18}/;
      if(!orderReg.test(that.data.orderNo)){
        wx.showToast({
          title:'订单号格式有误，请输入18位纯数字',
          icon:'none',
          success:function(){
            that.setData({
              subDisable:true,
              fontColor:'#b3b3b3',
              backColor:'#ebebeb'
            })
          }
        })
        return ;
      }
    }
    that.setData({
      subDisable:true,
      fontColor:'#b3b3b3',
      backColor:'#ebebeb'
    })
    if(that.data.choosePic){
      that.hasPicSub()
    }else{
      that.noPicSub()
    }  
  },

  
  hasPicSub:function(){           // 有图片的提交
    console.log('有图片的提交')
    let that = this;
    wx.uploadFile({
      url: App.globalData.url_base+'order?method=addZhangDZOrderImg', 
      filePath: that.data.choosePic,
      name: 'file',
      formData:{
        'method':'addZhangDZOrderImg',
        'token': App.globalData.Apptoken,
        'url_type':'order',
        'orderNo':that.data.orderNo,
        'goodsName':that.data.selectGood,
        'remark':that.data.note,
        'skuid':that.data.skuid
      },
      success: function(res){
        console.log(res.data)
        var data = JSON.parse(res.data)
        if(data.success == 1){   // 
          console.log(data.errorMessage)   
          wx.showToast({
            title:data.errorMessage,
            icon:'none',
            success:function(res){
              that.setData({
                orderNo:'',  //订单号
                selectGood:'',  //商品名字
                note:'',    //备注
                choosePic:'',   //
                isAuto:false,
                isChoose:false,
                skuid:'',  //选择商品的id
                imgType:'',   //图片类型
             })
            }
          }) 
        }else if(data.success == 0){
          wx.showToast({
            title:data.errorMessage,
            icon:'none',
            success:function(){
              that.setData({
                subDisable:false,
                fontColor:'#fff',
                backColor:'#b61c25'
              })
              wx.navigate({
                url:'/pages/login/login'
              })
            }
          })
        }else if(data.success == 2){
          wx.showToast({
            title:'该订单号已存在，请查看后填写',
            icon:'none'
          })
        }else{
          wx.showToast({
            title:data.errorMessage,
            icon:'none',
            success:function(res){
              that.setData({
                subDisable:false,
                fontColor:'#fff',
                backColor:'#b61c25'
              })
            }
          })
        }
      }
    })
  },

  noPicSub:function(){
    console.log('没有图片的提交')
    let that = this;
    let data={
      method:'addZhangDZOrder',
      token: App.globalData.Apptoken,
      url_type:'order',
      orderNo:that.data.orderNo,
      goodsName:that.data.selectGood,
      remark:that.data.note,
      skuid:that.data.skuid
    }
   
    api.reqData({
      data,
      success:function(res){
        console.log(res.data)
        if(res.data.success == 1){   //保存订单成功
          wx.showToast({
            title:'提交成功',
            icon:'none',
            success:function(res){
              that.setData({
                orderNo:'',  //订单号
                selectGood:'',
                note:'',
                isAuto:false,
                isChoose:false,
                skuid:'',    //选择商品的id
             })
            }
          }) 
        }else if(res.data.success == 0){
          wx.showToast({
            title:res.data.errorMessage,
            icon:'none',
            success:function(){
              that.setData({
                subDisable:false,
                fontColor:'#fff',
                backColor:'#b61c25'
              })
              wx.navigate({
                url:'/pages/login/login'
              })
            }
          })
        }else if(res.data.success == 2){
          wx.showToast({
            title:'该订单号已存在，请查看后填写',
            icon:'none'
          })
        }else{
          wx.showToast({
            title:res.data.errorMessage,
            icon:'none',
            success:function(res){
              that.setData({
                subDisable:false,
                fontColor:'#fff',
                backColor:'#b61c25'
              })
            }
          })
        }
      }
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