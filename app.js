import { ajax } from './resources/request.js'
App({
  globalData: {
    userInfo: {},
    userDataInfo:null,
    avatarUrl:null,
    nickname:null,
    gender:null,
    selectHosIndex:"",
    selectHospital:'',
    code:'',
    department:'',
    hospital:'',
    equipTimePlan:[],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    contId:'' 
  },
  ajax,
  onLaunch: function () {
    // 获取用户信息
   let  that = this
    wx.login({
      success: res => {
        var code =res.code
        if (res.code) {
          wx.getSetting({
            success: function (res) {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                  // withCredentials: true,
                  success: function (resp) {
                    that.globalData={
                      avatarUrl: resp.userInfo.avatarUrl,
                      nickName: resp.userInfo.nickName,
                      hospital: wx.getStorageSync('hospital')
                    }
                    if (wx.getStorageSync('sessionKey')){return}
                    else {
                      // // 模拟弹框出现 暂用page
                      // wx.showModal({
                      //   title: '微信授权',
                      //   content: '需要获取权限才能接下来操作',
                      //   success: function (res) {
                      //     if (res.confirm) {
                      //       console.log('用户点击确定')
                      //     } else if (res.cancel) {
                      //       console.log('用户点击取消')
                      //     }
                      //   }
                      // })
                      wx.redirectTo({
                        url: '../auth/auth',
                      })
                    }
                  },
                  fail: function () {
                  }
                })
              } else {
                wx.redirectTo({
                  url: '../auth/auth',
                })
              }
            }
          })
          that.globalData.code = res.code
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  
  }
})
