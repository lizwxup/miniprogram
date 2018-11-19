const app = getApp()
Page({
  data: {
    avatarUrl:'',
    code:"",
    gender:'',
    nickName:''
  },
  onGotUserInfo(e){
   let that = this
    wx.login({
      success: res => {
        console.log(e.detail.userInfo)
        if (e.detail.userInfo === undefined) {
          wx.showModal({
            title: '提示',
            showCancel:false,
            content: '请点击允许登录',
          })
        } else {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId  
          app.ajax('/anon/v1/doctor/login/wx', '', 'post', {
            code: res.code,
            avatarUrl: e.detail.userInfo.avatarUrl,
            gender: e.detail.userInfo.gender,
            nickName: e.detail.userInfo.nickName
          }, (res) => {
            if(res.data.code === 1) {
              app.globalData.contId = res.data.data
              if (that.employIdCallback) {
                that.employIdCallback(res.data.data);
              }
              if (res.header && res.header['Set-Cookie']) {
                var setcookie = res.header['Set-Cookie'];
                var start = setcookie.indexOf('JSESSIONID=');
                var end = setcookie.lastIndexOf(';');
                var session = setcookie.substring(start, end);
                wx.setStorage({
                  key: "sessionKey",
                  data: session
                })
              }
              app.globalData={
                nickName: res.data.data.name,
                hospital: res.data.data.hospital,
                department: res.data.data.department
              }
              wx.setStorage({
                key: "hospital",
                data: res.data.data.hospital
              })
              wx.setStorage({
                key: "nickName",
                data: res.data.data.name
              })
              wx.switchTab({
                url: '../index/index',
              })
            } else {
              console.log('登录失败')
            }
          })  
         }
        },function(fail){
          console.log(fail)
        }
      })
  },

})