
let equips = [];  //设备
let parts = [];  //部位
let methods = [];  //方法
var QR = require('../../utils/qrcode1.js')
const app = getApp()
Page({
    data:{
      mainSuit:'',
      medicalHistory:'',
      diagnosis:'',
      show:false,
      phoneValue:'',
      index: '-1',
      //ageIndex:'-1',
      name:'',
      showToast:false,
      stepIndex:'2',
      equipArr:[],
      partArr :[], 
      methodsArr:[],
      infoEquip:[], //获取三级联动的整体数据
      multiIndex: [0, 0, 0], //获取的整体的id值
      indexSlide:0,
      hospitalList:[],
      //数据新的
      equips: [],
      equip: "",
      parts: [],
      part: "",
      methods: [],
      method: '',
      methodId:[],
      methodsId:[],
      value: [0, 0, 0],
      values: [0, 0, 0],
      equipPartMethods:[],
      condition: false,
      selectHosId:'',
      maskFlag:false,
      seleAddress:'',
      seleHospital:'',
      selectHostipal:'',
      time:'',
      orderNum:'', //预约号
      canvasHidden: false,
      maskHidden: true,
      imagePath: '',
      placeholder: 'http://cloud.ezhenduan.com/micp'//默认二维码生成文本
     },
    bindTextAreaBlur:function(e){
      this.setData({
        mainSuit: e.detail.value
      })
    },
    bindTextmedicalHistoryBlur(e){
      this.setData({
        medicalHistory: e.detail.value
      })
    },
    bindTextdiagnosisBlur(e){
      this.setData({
        diagnosis: e.detail.value
      })
    },
    bindChange: function (e) {
      //console.log(e);
      console.log(e)
      var val = e.detail.value
      var t = this.data.values;
      var cityData = this.data.cityData;
      if (val[0] != t[0]) {
        const parts = [];
        const methods = [];
        const methodsId = [];
        for (let i = 0; i < cityData[val[0]].child.length; i++) {
          parts.push(cityData[val[0]].child[i].name)
        }
        for (let i = 0; i < cityData[val[0]].child[0].child.length; i++) {
          methods.push(cityData[val[0]].child[0].child[i].name)
          methodsId.push(cityData[val[0]].child[0].child[i].id)
        }

        this.setData({
          equip: this.data.equips[val[0]],
          part: cityData[val[0]].child[0].name,
          parts: parts,
          method: cityData[val[0]].child[0].child[0].name,
          methods: methods,
          methodsId: methodsId,
          methodId: cityData[val[0]].child[0].child[0].id,
          values: val,
          value: [val[0], 0, 0]
        })
        return;
      }
      if (val[1] != t[1]) {
        const methods = [];
        const methodsId =[];
        for (let i = 0; i < cityData[val[0]].child[val[1]].child.length; i++) {
          methods.push(cityData[val[0]].child[val[1]].child[i].name)
          methodsId.push(cityData[val[0]].child[val[1]].child[i].id)
        }
        this.setData({
          part: this.data.parts[val[1]],
          method: cityData[val[0]].child[val[1]].child[0].name,
          methods: methods,
          methodsId: methodsId,
          methodId: cityData[val[0]].child[val[1]].child[0].id,
          values: val,
          value: [val[0], val[1], 0]
        })
        return;
      }
      if (val[2] != t[2]) {
        this.setData({
          method: this.data.methods[val[2]],
          methodId: this.data.methodsId[val[2]],
          values: val
        })
        return;
      }
     },
      open: function () {
        this.setData({
          condition: !this.data.condition,
          show: !this.data.show,
          maskFlag: !this.data.maskFlag
        })
      },
      bindPickerChange:function(e){
        this.setData({
          index: e.detail.value
        })
      },
      bindKeyPhoneInput(e) {
        this.setData({
          phoneValue: e.detail.value
        })
      },
      bindPickerEquip(e){
        this.setData({
          multiIndex: e.detail.value
        })
      }, 
      //选择方法
      selectmethod(){
        let that = this
        var methodsInfo = {
          part: this.data.part,
          equip: this.data.equip,
          method: this.data.method,
          methodId: this.data.methodId
        }
        if (this.data.equipPartMethods.length !== 0 &&
          this.data.equip !== this.data.equipPartMethods[0].equip) {
          wx.showModal({
            title: '提示',
            content: '只能选择一种是设备，你确定要更换设备吗？',
            success(res){
             if (res.confirm){
               that.data.equipPartMethods = []
               let messageCon = that.data.equipPartMethods
               messageCon.push(methodsInfo)
               that.setData({ 
                 equipPartMethods: Array.from(new Set(messageCon)),
                 show:false,
                 maskFlag:false,
                 condition:false
                })
               console.log(that.data.maskFlag)
              // that.open()
             } else if (res.cancel){
                wx.showToast({
                  icon:'none',
                  title: '您点击了取消'
                })
             
              }
            },
          })
        } else {
          let self = this
          let messageCon = this.data.equipPartMethods
          messageCon.push(methodsInfo)
          self.setData({
            equipPartMethods: messageCon,
            show: false,
            maskFlag: false,
            condition: false
          })
        }
      },
      showMask(){
        this.setData({
          maskFlag: false,
          condition: false,
          show: false,
        })
      },
      deleMethod(e){
        let delMethod = this.data.equipPartMethods
        delMethod.splice(delMethod.findIndex(v => v.methodId === e.target.dataset.id ))
        this.setData({
          equipPartMethods: delMethod
        })
      },
      secondNextStep(e){
        let self = this
        console.log( e.target.dataset.id)
        if (e.target.dataset.id === '3') {
          //获取数据【地理位置】
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              var latitude = res.latitude
              var longitude = res.longitude
              self.getCancelLocation(latitude, longitude, e.target.dataset.id )
              },fail(fail){
               self.getCancelLocation('108.425125', '45.154568',e.target.dataset.id)
              }
          })
        } else if (e.target.dataset.id === '4') {
          if (self.data.selectHostipal === undefined || self.data.selectHostipal === ''){
            wx.showToast({
              icon: 'none',
              title: '请选择预约医院',
            })
          } else {
            self.setData({
              stepIndex: e.target.dataset.id
            })
            self.data.hospitalList.forEach((item,index)=>{
              if (item.id === self.data.selectHostipal) {
                    self.setData({
                      seleHospital: item.name,
                      seleAddress: item.address
                    })
                }
            })
          }
        }
      },
      getCancelLocation(longitude, latitude,id){
        let self = this
        if (self.data.equipPartMethods[0] === undefined) {
          wx.showToast({
            icon: 'none',
            title: '请选择设备',
          })
        } else {
          app.ajax('/v1/reservation/hospital', '', 'get', {
            id: self.data.equipPartMethods[0].methodId,
            longitude: longitude,
            latitude: latitude
          }, function (res) {
            self.setData({
              hospitalList: res.data.data,
              stepIndex: id
            })
          })
        }
       
      },
      thirdLastStep(e){
        this.setData({
          stepIndex: e.target.dataset.id
        })
      },
      cancel() {
        this.setData({
          showToast: false
        })
      },
      complete(){
        let that = this
        this.setData({
          stepIndex: '2'
        })
        wx.switchTab({
          url: '../index/index',
          success:function(e){
            var page = getCurrentPages().pop();
            if (page === undefined || page === null) {
              return ;
            }
            page.data.patientArray = []
            page.onLoad()
            console.log(page)
          },
        })

      },
      bindHospital(e){
        if (e.currentTarget.dataset.num === 0) {
          wx.showToast({
            icon:'none',
            title: '此医院不可预约',
          })
        } else {
          wx.navigateTo({
            url: '../orderTime/orderTime?hostipal=' + e.currentTarget.dataset.id +
                 '&surplusNum=' + e.currentTarget.dataset.num+
              '&methodId=' + this.data.equipPartMethods[0].methodId,
          })
        }
      },
      // confirm(){
      //   console.log(this.data.phoneValue)
      //   if (this.data.phoneValue == "" || 
      //   !(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/).test(this.data.phoneValue)) {
      //     wx.showToast({
      //       icon: "none",
      //       title: '手机号错误'
      //     })
      //   } else {
      //     this.setData({
      //       showToast: false,
      //       stepIndex:'5'
      //     })
      //   }   
      // },
       sureXin(){
         let self = this
         console.log(self.data.equipPartMethods)
         let mpiIds = []
         self.data.equipPartMethods.forEach((item)=>{
           mpiIds.push(item.methodId)
         })
         app.ajax('/v1/reservation/hospital/scheduling','','post',{
           id: wx.getStorageSync('selectTime'),
           source:'门诊',
           chiefComplaint: self.data.mainSuit || '无',
           medicalHistory: self.data.medicalHistory || '无',
           clinicalDiagnosis: self.data.diagnosis || '无',
           mpiIds: Array.from(new Set(mpiIds)).join(',')
         },(res)=>{
           if (res.data.code === 1){
              
             self.setData({
              //showToast: false,
              stepIndex:'5',
              orderNum:res.data.data.id
           })
             var size = this.setCanvasSize();//动态设置画布大小
             var initUrl = this.data.placeholder + '?id=' + this.data.orderNum;
             console.log(initUrl)
             this.createQrCode(initUrl, "mycanvas", size.w, size.h);
          }
         })
       },
      onShow:function(options){
        let that = this
        if (app.globalData.selectHospital!= undefined) {
          this.setData({
            selectHostipal: app.globalData.selectHospital
          })
        }
        if (app.equipTimePlan !=undefined) {
          app.equipTimePlan.map((item, index) => {
              item.child.map((itm,idx)=>{
                if (app.globalData.selectHosIndex === itm.id) {
                  that.setData({
                    time: item.date + ' ' + itm.splitStartTime + '-' + itm.splitEndTime
                  })
                }
              })
          })  
        }
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
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => { this.canvasToTempImage(); }, 1);

  },
  previewImage(){
    var img = this.data.imagePath;
    console.log(img)
    console.log('content')
    wx.previewImage({
      current: img,  // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          // canvasHidden:true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //页面加载
  onLoad: function (options) {
        let that = this
        if (options.selectId === undefined) {
        } else {
          that.setData({
            selectHosId: options.selectId
          })
        }
        //tcity.init(that);
        // if (app.globalData.contId && app.globalData.contId != ''){
        //   console.log('判断是否为空')
        // } else {
        //   app.employIdCallback = employId => {
              app.ajax('/v1/inspection/item/tree', '', 'get', '',function (res) {
              let infoEquip = that.data.cityData = res.data.data
              console.log(typeof that.data.cityData)
              var cityData = JSON.parse(JSON.stringify(that.data.cityData));
              const equips = [], parts = [], methods = [], methodsId = [];
              for (let i = 0; i < cityData.length; i++) {
                equips.push(cityData[i].name);
              }
              for (let i = 0; i < cityData[0].child.length; i++) {
                parts.push(cityData[0].child[i].name)
              }
              for (let i = 0; i < cityData[0].child[0].child.length; i++) {
                methods.push(cityData[0].child[0].child[i].name)
                methodsId.push(cityData[0].child[0].child[i].id)
              }
              that.setData({
                'equips': equips,
                'parts': parts,
                'methods': methods,
                'methodsId': methodsId,
                'equip': cityData[0].name,
                'part': cityData[0].child[0].name,
                'method': cityData[0].child[0].child[0].name,
                'methodId': cityData[0].child[0].child[0].id,
                 stepIndex: '2'
              })
            });
          //}
        }
})