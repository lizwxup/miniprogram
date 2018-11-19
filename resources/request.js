function ajax(curl, message, method, data,success, fail, complete) {
  if (message != '') {
    wx.showToast({
      icon: "loading",
      title: message
    })
  }
  //header
  let header = {
    "Content-Type": (method === 'post' || method === 'put' ? "application/x-www-form-urlencoded":'application/json') 
  }
  let cookie = wx.getStorageSync('sessionKey');
  if (cookie) {
    header.cookie = cookie
  } 
  //get参数拼接   130  106 wuxian
  let urlPort = "http://192.168.2.145:8066";
  var params = '',url='';
  if (method === 'get' && data != ''){
      for ( var i in data) {
        if (data[i].toString()!='') {
          url = urlPort + curl+ "&" + i + "=" + data[i];
      }
    }
  } 
  url = urlPort + curl;
  wx.request({
    url: url,
    method: method,
    header: header,
    data:data,
    success: function (res) {
    if (res.data.code ===1){
       wx.hideToast();
       success(res)
      } else{
        if (res.data.code === 30002) {
         wx.redirectTo({
           url: '../auth/auth',
         })
        } else if (res.data.code === 20101) {
          wx.showToast({
            title: '已无更多数据',
            icon: 'none'
          })
          success(res)
        } else{
          
          wx.showToast({
            title: res.data.msg || '网络错误',
            icon: 'none'
          }) 
        } 
      }  
    },
    fail: function () {
     // fail()
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    },
    complete: function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  })
}  
module.exports = {
  ajax
}