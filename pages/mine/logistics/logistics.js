const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js');
const App = getApp();

Page({
  data: {
    mailNo: '',
    expressCom:'',
    rps_data:[],
    orderState:''
  },

  //初始化数据加载
  onLoad: function (option) {
    this.setData({
      mailNo: option.logistics_numbers,
      expressCom:option.expressCom,
    })
    this.findLogisticsMsg();
  },

  findLogisticsMsg() {
    const self = this;
    let data={
      method:'execLookKuaiDi',
      expressType:self.data.expressCom ,
      expressNo:self.data.mailNo,
      url_type: 'order'
   }
   api.reqData({
     data,
     success: (res) => {
        if(res.data.status == 200){
          console.log(res)
          for(var i= 0; i < res.data.data.length;i++){
            let context = res.data.data[i].context.replace('<i>', '').replace('</i>/', '');
            res.data.data[i].context = context
          }
          self.setData({
            rps_data: res.data.data,
            orderState:res.data.state
          })
        }else{
          setTimeout(function(){
            wx.showToast({
              title:'该快递暂不支持查询',
              icon:'none'
            })
          },2000)
        }
     },
   })



    //https://biz.trace.ickd.cn/auto/488705978277?mailNo=488705978277
    // let base = 'https://biz.trace.ickd.cn/auto/'
    // let data = {
    //   mailNo:this.data.mailNo,
    // }
    // let url=base+this.data.mailNo+'?mailNo='+this.data.mailNo;
    // url = url.replace(/ /g, '');
    // wx.request({
    //   url:url,
    //   data: data,
    //   method: 'get',
    //   header: { 'Content-Type': 'application/json' },
    //   success: function (res) {
    //     console.log(url)
    //     console.log(res.data)
    //     for(var i= 0; i < res.data.data.length;i++){
    //       let context = res.data.data[i].context.replace('<i>', '').replace('</i>/', '');
    //       res.data.data[i].context = context
    //     }
      
    //     self.setData({
    //       rps_data: res.data.data,
    //     })
    //   },
    //   fail: function (res) {
    //     console.log(res)
    //   }
    // })  
  },

  //拉到底部刷新
  onPullDownRefresh() {
    console.info('onPullDownRefresh')
    if (!this.data.rps_data.paginate.hasNext) return
    this.getList()
  },


})
