
//index.js
//获取应用实例
const app = getApp()
var QR = require('../../resources/qrcode.js')           
Page({
  data: {
    showModal: false,
    isShow: true,
    qrcode:true,
    isNavShow:false,
    currentTab: 0,
    userInfo: {},
    disgnosId: '',//预约单数据展示
    sessionId:'',
    optionsId:'',
    orderData:{},
    windowHeight:'',
    placeholder: 'http://cloud.ezhenduan.com/micp',//默认二维码生成文本
    showQrcode:false,
    imagePath: '',
  },
   //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
      console.log(size.h)
    } catch (e) {
    }
    return size;
  },
  showQrcode(){
    this.setData({
      showQrcode:true
    })
  },
  hideQrcode(){
    this.setData({
      showQrcode: false
    })
  },
  goToReport(){
    wx.navigateTo({
      url: '../reportList/reportList?id=' + this.data.optionsId,
    })
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
     this.canvasToTempImage();
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'qrcode',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          imagePath: tempFilePath,
        }); 
        var img = that.data.imagePath;
        wx.previewImage({
          current: img,  
          urls: [img] 
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    let that = this
    var size = this.setCanvasSize();//动态设置画布大小
    var initUrl = this.data.placeholder + '?id=' + this.data.optionsId;
    this.createQrCode(initUrl, "qrcode", size.w, size.h);
  },
  //请求的数据---详情
  requestDetailData:function(options){
    var that=this;
    //调用接口
    app.ajax('/v1/reservation/info', '加载中...', 'get', {
      id: that.data.optionsId
    },function (res) {
      if (res.data.data == null) {
        
      } else {
        that.setData({
          orderData: res.data.data,
        });
      }
    });
  },
  onLoad: function (options) {
     // 页面初始化 options为页面跳转所带来的参数
    var that=this; 
    that.setData({
      optionsId:options.oid,
    });
    wx.hideShareMenu()
    that.requestDetailData(options.oid);
    var size = this.setCanvasSize();//动态设置画布大小
   
  }
})
