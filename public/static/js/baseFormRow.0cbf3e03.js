(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["baseFormRow"],{"36b0":function(e,t,a){"use strict";a.r(t);var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("page",[a("el-button",{on:{click:e.go}},[e._v("提交")]),a("base-form",{attrs:{data:e.formInfo},on:{event:e.event}})],1)},o=[],i=(a("4de4"),a("588d")),n=[{aaa:"显示密码框",bbb:"显示密码框"},{aaa:"不显示密码框",bbb:"不显示密码框"}],r={start:"08:30",step:"00:15",end:"18:30"},s=[{label:"1",text:"选项一"},{label:"2",text:"选项二"}],d=[{label:"1"},{label:"2"}],f={data:function(){var e=this;return{formInfo:{list:[{label:"账号",field:"__input",type:"input",tip:!0,rules:[{required:!0,message:"请输入",trigger:"blur"},{validator:i["demo"],trigger:"blur"}]},{label:"密码",field:"__password",type:"password"},{label:"下拉框",field:"__select",type:"select",options:n,key:"aaa",value:"bbb"},{label:"时间",field:"__time",type:"time",options:r},{label:"日期",field:"__date",type:"date"},{label:"日期时间",field:"__dateTime",type:"datetime"},{label:"开关",field:"__switch",type:"switch",cancel:"关闭",confirm:"开启",activeValue:1,activeInValue:0},{label:"单选框",field:"__radio",type:"radio",options:s},{label:"多选框",field:"__checkbox",type:"checkbox",options:d},{label:"文本域",field:"__textarea",type:"textarea",row:5},{label:"搜索过滤",field:"__auto",type:"auto",filter:e.filter}],formDOM:null,data:{},labelWidth:"200px",isRow:!0}}},methods:{filter:function(e,t){var a=[{value:"三全鲜食（北新泾店）",address:"长宁区新渔路144号"},{value:"Hot honey 首尔炸鸡（仙霞路）",address:"上海市长宁区淞虹路661号"}];t(a)},go:function(){var e=this;this.formInfo.formDOM.validate((function(t){t&&console.log(e.formInfo.data,"表单的值")}))},event:function(e){console.log(e,"事件")}},mounted:function(){var e=this;setTimeout((function(){e._setdata(e.formInfo,{__input:"远程远程远程远程远程远程远程远程远程远程远程远程远程远程远程远程远程远程"}),e.formInfo.data.sss="被修改"}),1e3)}},b=f,u=a("2877"),c=Object(u["a"])(b,l,o,!1,null,null,null);t["default"]=c.exports}}]);