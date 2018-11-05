var api = require('../../../utils/api.js')
const app = getApp();
var area = require('../../../utils/area.js')
var util = require("../../../utils/util.js")

var areaInfo = [];//所有省市区县数据

var provinces = [];//省

var citys = [];//城市

var countys = [];//区县

var index = [0, 0, 0];

var cellId;

var t = 0;
var show = false;
var moveY = 200;

Page({
  data: {
    show: show,
    provinces: provinces,
    citys: citys,
    countys: countys,
    value: [0, 0, 0],
    areaCode: '000000',                     //省市区的code码
    defaultadd:false,                      //勾选默认地址
    firstimg:"../../../image/nogx.png",
    secondimg:"../../../image/gx.png",
    isdefault:0, 
    province:'',
    city: '',
    county: '' ,
    addressId:"",
    is_first_action:0,  //为0就提交地址，只提交一次
    isFocus:false
  },


 //设置默认地址
  setdefault:function(e){
    //添加页面过来的是0来标识，现在页面上修改状态，在后台插入数据的时候同意提交数据0；否则传具体的id
    const delid = e.currentTarget.dataset.id
    if (delid==0){
      this.setData({
        defaultadd: true,
        isdefault: 1,
        addressId:'0000'
      })
      return
    }
    let data = {
      method: 'serDefault',
      addressId: delid,
      token: app.globalData.Apptoken,
      url_type: 'my'
    }
    api.reqData({
      data,
      success: (res) => {
        console.log(res)
        if(res.data.success==1){
          this.setData({
            defaultadd: true,
            isdefault: 1
          })
        }else{
          this.setData({
            defaultadd: false,
            isdefault: 0
          })
          console.log("设置默认地址失败")
        }     
      },
      fail: (res) => {  
        console.log("设置默认地址失败")
      }
    })
  },
  checkName:function(e){
    var name = util.regexConfigname().name;
    var inputName = e.detail.value;
    console.log(e.detail.value)
    if (!name.test(inputName)){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的名字'
      });
      this.setData({
        inputFocus:true
      })
      
    }
  },
  checkPhone:function(e){
    var phone = util.regexConfig().phone;
    var inputPhone = e.detail.value;
    console.log(e.detail.value)
    if (!phone.test(inputPhone)){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的手机号码'
      });
      this.setData({
        inputFocus:true
      })
      
    }
  },

  onLoad: function (options) {
    index = [0, 0, 0];
    console.log(options,index);
    if(options.addressId != 0){
      wx.setNavigationBarTitle({
        title: '编辑收货地址'
      })
    }
    cellId = options.cellId;
    var that = this;
    var date = new Date()
    console.log(date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日");
    //获取省市区县数据
    area.getAreaInfo(function (arr) {
      areaInfo = arr;
      //获取省份数据
      getProvinceData(that);
    });
    if ( options.addressId != 0) {
      this.getAddressInfo(options)
    } else {
      this.newAddressInfo(options);
      this.setData({

      })
    }
 
  },

  getAddressInfo(options){
    console.log(options)
    this.setData({
      addressId: options.addressId,    //放置addressId
    })
    //查询地址接口
    let data = {
      method: 'getAddress',
      addressId: options.addressId,
      token: app.globalData.Apptoken,
      url_type: 'my'
    }
  
    api.reqData({
      data,
      success: (res) => {
        console.log(res.data.result.rs[options.suoyin])
        const listadd = res.data.result.rs[options.suoyin]
        this.setData({
          form: listadd,
          province: listadd.delivery_address,
          isdefault: listadd.is_default
        })
      },
    })
  },

  newAddressInfo: function (e) {
    this.setData({
      form: [],
      addressId: '0000'
    })
  },
  checkUsername: function (e) {
    //调用util中名字的正则校验
    var name = util.regexConfigname().name;
    if(!name.test(e.detail.value)){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的姓名'
      });
      return false;
    }
  },

  checkUserphone: function (e) {
    //调用util中手机号码的正则校验
    var phone = util.regexConfig().phone;
    if(!phone.test(e.detail.value)){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的手机号码'
      });
     this.setData({
       isFocus:true
     })
    }
  },
  //拿到新增地址里的信息
  bindSave: function (e) {
    var provicename = this.data.province
    var cityname = this.data.city
    var county = this.data.county
    var total = provicename + cityname + county
    const addmes = {
      linkMan: e.detail.value.linkMan,
      mobile: e.detail.value.mobile,
      address:e.detail.value.address,
      area : e.detail.value.code || this.data.areaCode,
    }
    console.log(addmes)

    if (this.data.addressId == '0000'){
    //新增地址接口
      if(!addmes.linkMan){
        wx.showToast({
          title:'请输入姓名',
          icon:'none'
        })
        return false;
      }else{
         var name = util.regexConfigname().name;
        if(!name.test(addmes.linkMan)){
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '请输入正确的姓名'
          });
          return false;
        }
      }
      if(!addmes.mobile){
        wx.showToast({
          title:'请输入手机号码',
          icon:'none'
        })
        return false;
      }else{
        var phone = util.regexConfig().phone;
        if(!phone.test(addmes.mobile)){
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '请输入正确的手机号码'
          });
          return false;
        }
      }
      if(!provicename || !cityname){
        console.log(total)
        wx.showToast({
          title:'请选择所在地区',
          icon:'none'
        })
        return false;
      }
      if(!addmes.address){
        console.log(addmes.address)
        wx.showToast({
          title:'请输入详细地址',
          icon:'none'
        })
        return false;
      }
     
      let data = {
        method: 'addAddress',
        deliveryAddress: total,
        deliveryAddressSec: addmes.address,
        consignee: addmes.linkMan,
        consigneeTel: addmes.mobile,
        addressName: "公司",
        districtCode: addmes.area,
        isDefault: this.data.isdefault,
        token: app.globalData.Apptoken,
        url_type: 'my'
      }
      console.log(data)
      if(this.data.is_first_action == 0){
        this.setData({
          is_first_action:1
        })
        api.reqData({
          data,
          success: (res) => {
            console.log(res)
            var addressId = res.data.result.ids[0]
            console.log(addressId)
            wx.showToast({
              title: '添加地址成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function(){
              wx.navigateBack();
            },2000);
            this.setData({
              is_first_action:1
            })
          },
        }) 
      } 
    }else{
      let data = {
        method: 'editAddress',
        deliveryAddress:total,
        deliveryAddressSec: addmes.address,
        consignee: addmes.linkMan,
        consigneeTel: addmes.mobile,
        addressName: "公司",
        districtCode: addmes.area,
        isDefault: this.data.isdefault,
        addressId: this.data.addressId,
        token: app.globalData.Apptoken,
        url_type: 'my'
      }
      console.log(data)
      api.reqData({
        data,
        success: (res) => {
          if(res.data.success == 1){
            wx.showToast({
              title: '编辑地址成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function(){
              wx.navigateBack({
                url: '/pages/mine/myaddress/myaddress'
              })
            },2000);
          }
        },
      })
    }
  },




  // ------------------- 分割线 --------------------
  onReady: function () {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    }
    )
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },
  //滑动事件
  bindChange: function (e) {
    console.log(e);
    var val = e.detail.value
    // console.log(e)
    //判断滑动的是第几个column
    //若省份column做了滑动则定位到地级市和区县第一位
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      getCityArr(val[0], this);//获取地级市数据
      getCountyInfo(val[0], val[1], this);//获取区县数据
    } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != val[1]) {
        val[2] = 0;
        getCountyInfo(val[0], val[1], this);//获取区县数据
      }
    }
    
    index = val;
    console.log(index + " => " + val);



    //获取省市区code
    var areaCode;
    if (countys[val[2]].code == undefined) {
      areaCode = provinces[val[0]].code;
    } else {
      areaCode = countys[val[2]].code;
    }

    //判断 如果选择“市辖区”的话，给后台 省和市的数据就行，不传"市辖区" 
    if (countys[val[2]].name == '市辖区') {
      areaCode = citys[val[1]].code;
    }

   
    // console.log(areaCode)
    // console.log(countys[val[2]].name)

    //更新数据
    this.setData({
      value: [val[0], val[1], val[2]],
      province: provinces[val[0]].name,
      areaCode: areaCode,
      city: citys[val[1]].name,
      county: countys[val[2]].name
    })

  },

  //移动按钮点击事件
  translate: function (e) {

    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
     
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    // this.animation.translate(arr[0], arr[1]).step();
    animationEvents(this, moveY, show);

  },
  //隐藏弹窗浮层
  hiddenFloatView(e) {
    // console.log(e);
    // moveY = 200;
    // show = true;
    // t = 0;
    // animationEvents(this, moveY, show);
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;

    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    animationEvents(this, moveY, show);
  },
 
  //页面滑至底部事件
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
  tiaozhuan() {
   
  },
  //确定改变地址
  changeAddress: function () {
    console.log(show)
    if (!show && index[0] == 0 && index[1] == 0 && index[2]==0){
      //更新数据
      this.setData({
        value: [0, 0, 0],
        province: provinces[0].name,
        city: citys[0].name,
        county: countys[0].name
      })
    }else{
      //更新数据
      this.setData({
        value: [index[0], index[1], index[2]],
        province: provinces[index[0]].name,
        city: citys[index[1]].name,
        county: countys[index[2]].name
      })
    }
    moveY = 200;
    show = true;
    t = 0;
    animationEvents(this, moveY, show);
  },
  //取消改变地址
  cancel: function () {

  }
})

//动画事件
function animationEvents(that, moveY, show) {
  console.log("moveY:" + moveY + "\nshow:" + show);
  // 触发关闭动画时，如未选择省份则定义为使用默认数据；
  // Q1: 如何判断初次的关闭
  // if (!show && provinces.length) {
  //   that.setData({
  //     province: provinces[0].name,
  //     city: citys[0].name,
  //     county: countys[0].name
  //   })
  // }
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  })
  that.animation.translateY(moveY + 'vh').step()

  that.setData({
    animation: that.animation.export(),
    show: show
  })

}

// ---------------- 分割线 ---------------- 

//获取省份数据
function getProvinceData(that) {
  // provinces = [];
  // for (var i = 0; i < areaInfo.length; i++) {
  //   var oItem = areaInfo[i];
  //   if (oItem.di == "00" && oItem.xian == "00") {
  //     provinces.push(oItem);
  //   }
  // }
  var s;
  provinces = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    s = areaInfo[i];
    if (s.di == "00" && s.xian == "00") {
      provinces[num] = s;
      num++;
    }
  }
  that.setData({
    provinces: provinces
  })

  //初始化调一次
  getCityArr(0, that);
  getCountyInfo(0, 0, that);
  that.setData({
    province: "请选择",
    city: "",
    county: "",
  })
}

// 获取地级市数据
function getCityArr(count, that) {
  var c;
  citys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
      citys[num] = c;
      num++;
    }
  }
  if (citys.length == 0) {
    citys[0] = { name: '' };
  }

  that.setData({
    city: "",
    citys: citys,
    value: [count, 0, 0]
  })
}

// 获取区县数据
function getCountyInfo(column0, column1, that) {
  var c;
  countys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
      countys[num] = c;
      num++;
    }
  }
  if (countys.length == 0) {
    countys[0] = { name: '' };
  }
  that.setData({
    county: "",
    countys: countys,
    value: [column0, column1, 0]
  })
}