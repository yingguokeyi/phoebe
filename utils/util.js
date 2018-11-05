const formatTime = date => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//鉴于后台特殊时间格式，现特提供统一功能方法
function formatTimeStyle(lengthnum) {
  var timeList = []
  for (var i = 0; i < lengthnum.length; i++) {
    var num = lengthnum[i].created_date     //拼接时间
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
    lengthnum[index].created_date = item        //将接口里的时间参数替换成需要的格式
  })
  return lengthnum;
}

function formatTm(lengthnum) {
  var timeList = []
  for (var i = 0; i < lengthnum.length; i++) {
    var num = lengthnum[i].operator_time     //拼接时间
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
    lengthnum[index].operator_time = item        //将接口里的时间参数替换成需要的格式
  })
  return lengthnum;
}


function js_date_time(unixtime) {
  var dateTime = new Date(parseInt(unixtime) * 1000)
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var timeSpanStr = year + '-' + month + '-' + day ;
  return timeSpanStr;
}

//把时间改成年月日的方法
function acquisitionTime(lengthdate){
    // var value = lengthdate[i].order_create_time     //拼接时间
    var value1 = new Date(lengthdate*1000);
    var Y = value1.getFullYear();
    var m = value1.getMonth() + 1;
    var d = value1.getDate();
    var H = value1.getHours();
    var i = value1.getMinutes();
    var s = value1.getSeconds();
    if (m < 10) {
        m = '0' + m;
    }
    if (d < 10) {
        d = '0' + d;
    }
    if (H < 10) {
        H = '0' + H;
    }
    if (i < 10) {
        i = '0' + i;
    }
    if (s < 10) {
        s = '0' + s;
    }
    var t = Y+'年'+m+'月'+d+'日 '+H+':'+i+':'+s;
    return t;

  // }
  // console.log(timeList)
  // timeList.forEach(function (item, index) {
  //   lengthdate[index].order_create_time = item        //将接口里的时间参数替换成需要的格式
  // })
  // return lengthdate;
}

// 开始倒计时的时间格式
function elapsedTime(lengthdate){
  var timeList = []
  for (var i = 0; i < lengthdate.length; i++) {
    var d = lengthdate[i].sekillStartTime     //拼接时间
    var str = d
    var str1 = str.substring(0, 4)
    var str2 = str.substring(4, 2)
    var str3 = str.substring(6, 2)
    var str4 = str.substring(8, 2)
    var str5 = str.substring(10, 2)
    var str6 = str.substring(12, 2)
    var time = str4 + ':' + str5 + ':' + str6;
    timeList.push(time)
  }
  timeList.forEach(function (item, index) {
    lengthdate[index].sekillStartTime = item        //将接口里的时间参数替换成需要的格式
  })
  return lengthdate;

}

// 结束倒计时的时间格式
function finishTime(lengthdate) {
  var timeList = []
  for (var i = 0; i < lengthdate.length; i++) {
    var d = lengthdate[i].sekillEndTime     //拼接时间
    var str = d
    var str1 = str.substr(0, 4)
    var str2 = str.substr(4, 2)
    var str3 = str.substr(6, 2)
    var str4 = str.substr(8, 2)
    var str5 = str.substr(10, 2)
    var str6 = str.substr(12, 2)
    var time = str4 + ':' + str5 + ':' + str6;
    timeList.push(time)
  }
  timeList.forEach(function (item, index) {
    lengthdate[index].sekillEndTime = item        //将接口里的时间参数替换成需要的格式
  })
  return lengthdate;

}
// 电话号码隐藏中间的
function acquisitionPhone(lengthphone) {
  var timeList = []
  for (var i = 0; i < lengthphone.length; i++) {
    var phone = lengthphone[i].custom_parameters     
    var str =  phone
    var str1 = str.substr(0, 3)
    var str2 = str.substr(3, 2)
    var str3 = str.substr(5, 2)
    var str4 = str.substr(7, 2)
    var str5 = str.substr(9, 2)
    var str6 = str.substr(11, 2)
    // var str1 = str.substr(0, 3)
    // var str2 = str.substr(7)
    var phone = str1 + '****' + str4  + str5 + str6;
    timeList.push(phone)
  }
  timeList.forEach(function (item, index) {
    lengthphone[index].custom_parameters = item        
  })
  return lengthphone;
}

// 手机号验证的正则表达式
function regexConfig(){
  var reg = {
    phone:/^1(3|4|5|7|8|9)\d{9}$/
  }
  return reg;
}
// 姓名验证的正则表达式
function regexConfigname(){
  var reg = {
    name:/^[A-Za-z0-9\u4e00-\u9fa5]+$/
  }
  return reg;
}



module.exports = {
  formatTime: formatTime,
  regexConfig: regexConfig,
  regexConfigname: regexConfigname,
  formatTimeStyle: formatTimeStyle,
  acquisitionTime: acquisitionTime,
  acquisitionPhone: acquisitionPhone,
  formatTm: formatTm,
  elapsedTime: elapsedTime,
  finishTime: finishTime,
  js_date_time:js_date_time
   
}
