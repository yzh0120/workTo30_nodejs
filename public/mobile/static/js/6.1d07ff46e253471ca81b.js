webpackJsonp([6],{"0IIe":function(t,s){},YJaa:function(t,s,i){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var e=i("oslt"),a=i("NYxO"),n=(Object(a.a)("list"),Object(a.a)("login"),{name:"",activated:function(){this.firstEnter>1&&"/read"!==this.fromPath&&"/search"!=this.fromPath?(this.isBuffering=!0,this.list.length=0,this.onLoad()):this.firstEnter++},data:function(){return{firstEnter:0,listApi:["articleAndCol","articleAndColMore"],list:[],loading:!1,finished:!1,isLoading:!1}},filters:{},methods:{mountedFn:function(){this.firstEnter++,this.isBuffering=!0},getArticle:function(t,s){var i=this;this.$api.article.articleAndCol(t).then(function(t){i.isBuffering=!1,i.isLoading=!1,i.loading=!1,i.finished=!1,console.log(t.data),"no_list_login"==t.data?(i.finished=!0,i.$dialog.confirm({title:"您尚未登录",message:"需要跳转登录页吗?"}).then(function(){i.$router.push({path:"/login"})}).catch(function(){})):"no_data"==t.data?i.finished=!0:t.data.finished?(i.finished=!0,i.getFn(t.data.result,s)):t.data.ok?i.getFn(t.data.result,s):i.finished=!0})},getFn:function(t,s){for(var i=this,e=0;e<t.length;e++){t[e].article_publish_time=this.$formatDate(new Date(t[e].article_publish_time)),this.$refs.tempForMe.innerHTML=t[e].article_content,t[e].article_content=this.$refs.tempForMe.textContent,t[e].hasImg={hasImgONe:!1,hasImgTag:!1,imgArr:[]};var a=this.$refs.tempForMe.getElementsByTagName("img");if(1==!!a[0])if(a.length<3)t[e].hasImg.hasImgONe=!0,t[e].hasImg.imgArr[0]=a[0].src;else{t[e].hasImg.hasImgTag=!0;for(var n=0;n<3;n++)t[e].hasImg.imgArr[n]=a[n].src}}switch(s){case 0:this.list=t;break;case 1:this.list=this.list.concat(t)}this.$nextTick(function(){for(var t=0;t<=i.list.length-1;t++)1==!!i.list[t].hasImg.hasImgONe?i.$refs["des"+t][0].classList.add("oneImg"):1==!!i.list[t].hasImg.hasImgTag?i.$refs["des"+t][0].classList.add("threeImg"):i.$refs["des"+t][0].classList.add("noImg")})},onRefresh:function(){this.list.length=0,this.onLoad()},articleJump:function(t){this.$router.push({path:"/read",query:{articleId:t}})},onLoad:function(){var t={};switch(this.$route.query.articleAndCol){case"article":t={articleAndCol:"article"};break;case"col":t={articleAndCol:"col"}}this.$route.query.otherUserId&&(t.otherUserId=this.$route.query.otherUserId),1==!!this.list[0]?(1==!!this.list[this.list.length-1].col_publish_time?t.time=this.list[this.list.length-1].col_publish_time:t.time=this.list[this.list.length-1].article_publish_time,this.getArticle(t,1)):this.getArticle(t,0)}},computed:{fromPath:{get:function(){return this.$store._modulesNamespaceMap["path/"].context.state.fromPath},set:function(t){this.$store._modulesNamespaceMap["path/"].context.commit("fromPathHandler",t)}},isBuffering:{get:function(){return this.$store._modulesNamespaceMap["win/"].context.state.isBuffering},set:function(t){this.$store._modulesNamespaceMap["win/"].context.commit("isBufferingHandler",t)}}},components:{UserTag:e.a},mounted:function(){this.mountedFn()},watch:{}}),r={render:function(){var t=this,s=t.$createElement,i=t._self._c||s;return i("div",{staticClass:"listBoss"},[i("van-pull-refresh",{attrs:{"success-text":"刷新成功"},on:{refresh:t.onRefresh},model:{value:t.isLoading,callback:function(s){t.isLoading=s},expression:"isLoading"}},[i("van-list",{staticClass:"list",attrs:{finished:t.finished,"finished-text":"没有更多了"},on:{load:t.onLoad},model:{value:t.loading,callback:function(s){t.loading=s},expression:"loading"}},[i("div",{ref:"tempForMe",staticClass:"temp"}),t._v(" "),t._l(t.list,function(s,e){return i("div",{key:s.article_id,staticClass:"item",on:{click:function(i){return t.articleJump(s.article_id)}}},[i("UserTag",{attrs:{msgg:s}}),t._v(" "),i("div",{staticClass:"middle"},[i("div",{staticClass:"title "},[t._v(t._s(s.article_title))]),t._v(" "),i("div",{staticClass:"ccc"},[i("div",{ref:"des"+e,refInFor:!0,staticClass:"content van-multi-ellipsis--l3"},[t._v(t._s(s.article_content))]),t._v(" "),i("img",{directives:[{name:"show",rawName:"v-show",value:s.hasImg.hasImgONe,expression:"item.hasImg.hasImgONe"}],attrs:{src:s.hasImg.imgArr[0],alt:""}})]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:s.hasImg.hasImgTag,expression:"item.hasImg.hasImgTag"}],staticClass:"imgs"},t._l(s.hasImg.imgArr,function(t,s){return i("img",{key:s,staticClass:"hasImg",attrs:{src:t}})}),0)]),t._v(" "),i("div",{staticClass:"bottom"},[i("div",[i("i",{staticClass:"iconfont time"},[t._v("")]),t._v(" "),i("span",{staticClass:"spanOne"},[t._v(t._s(t._f("fTime")(s.article_publish_time)))])]),t._v(" "),i("div",[i("i",{staticClass:"iconfont eye"},[t._v("")]),t._v(" "),i("span",{staticClass:"spanOne"},[t._v(t._s(s.article_look_count))])]),t._v(" "),i("div",[i("i",{staticClass:"iconfont comment"},[t._v("")]),t._v(" "),i("span",{staticClass:"spanOne"},[t._v(t._s(s.article_comment_count))])]),t._v(" "),i("div",[i("i",{staticClass:"iconfont col"},[t._v("")]),t._v(" "),i("span",[t._v(t._s(s.article_col_count))])])])],1)})],2)],1)],1)},staticRenderFns:[]};var o=i("VU/8")(n,r,!1,function(t){i("0IIe"),i("aXdR")},"data-v-a3487074",null);s.default=o.exports},aXdR:function(t,s){}});
//# sourceMappingURL=6.1d07ff46e253471ca81b.js.map