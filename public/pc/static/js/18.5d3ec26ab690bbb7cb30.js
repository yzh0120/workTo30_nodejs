webpackJsonp([18],{JABh:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("Dd8w"),s=n.n(i),o=n("oslt"),a=n("NYxO"),r=Object(a.a)("list"),c=Object(a.a)("login"),l={name:"",activated:function(){this.userInfo.user_unread>0?(this.isBuffering=!0,this.list.length=0,this.onLoad(),this.setHandler(["user_unread","jian"])):this.firstEnter>1&&"/read"!=this.fromPath&&"/search"!=this.fromPath?(this.isBuffering=!0,this.list.length=0,this.onLoad()):this.firstEnter++},data:function(){return{firstEnter:0,list:[],loading:!1,finished:!1,isLoading:!1}},filters:{},methods:s()({mountedFn:function(){this.firstEnter++,this.isBuffering=!0}},c.mapMutations({setHandler:"setHandler"}),{getArticle:function(t,e){var n=this;this.$api.user.info(t).then(function(t){console.log(t.data,"用户消息数据"),n.isBuffering=!1,n.isLoading=!1,n.loading=!1,n.finished=!1,"no_data"==t.data?n.finished=!0:t.data.finished?(n.finished=!0,n.getFn(t.data.result,e)):t.data.ok?n.getFn(t.data.result,e):n.finished=!0})},getFn:function(t,e){console.log(t,"argargargargargargargargargargarg");for(var n=0;n<t.length;n++)t[n].info_time=this.$formatDate(new Date(t[n].info_time)),t[n].user_info_not_found&&(t[n].user_info={replyTemp:{}});switch(e){case 0:this.list=t;break;case 1:this.list=this.list.concat(t)}},onRefresh:function(){this.list.length=0,this.onLoad()},toRead:function(t){this.$router.push({path:"/read",query:{articleId:t}})},onLoad:function(){if(1==!!this.list[0]){var t={time:this.list[this.list.length-1].info_time};this.getArticle(t,1)}else this.getArticle({},0)}}),computed:s()({},c.mapState({userInfo:function(t){return t.userInfo}}),{fromPath:{get:function(){return this.$store._modulesNamespaceMap["path/"].context.state.fromPath},set:function(t){this.$store._modulesNamespaceMap["path/"].context.commit("fromPathHandler",t)}},isBuffering:{get:function(){return this.$store._modulesNamespaceMap["win/"].context.state.isBuffering},set:function(t){this.$store._modulesNamespaceMap["win/"].context.commit("isBufferingHandler",t)}}},r.mapState({info:function(t){return t.info}})),components:{UserTag:o.a},mounted:function(){this.mountedFn()},watch:{}},f={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"info"},[n("van-pull-refresh",{attrs:{"success-text":"刷新成功"},on:{refresh:t.onRefresh},model:{value:t.isLoading,callback:function(e){t.isLoading=e},expression:"isLoading"}},[n("van-list",{staticClass:"list",attrs:{finished:t.finished,"finished-text":"没有更多了"},on:{load:t.onLoad},model:{value:t.loading,callback:function(e){t.loading=e},expression:"loading"}},t._l(t.list,function(e,i){return n("div",{key:t.list.info_id,staticClass:"showComment ",on:{click:function(n){return t.toRead(e.info_article_id)}}},[n("UserTag",{staticClass:"headPor",attrs:{msgg:e.user_info}}),t._v(" "),n("div",{staticClass:"bottom"},[n("div",[n("i",{staticClass:"iconfont time"},[t._v("")]),t._v(" "),n("span",{staticClass:"spanOne"},[t._v(t._s(t._f("fTime")(e.info_time)))])]),t._v(" "),n("div",[e.user_info.comment_index?n("span",[t._v("\n              "+t._s(e.user_info.comment_index)+"楼\n          ")]):t._e()])]),t._v(" "),e.info_is_reply_comment?n("div",[n("div",{staticClass:"replyComment"},[n("div",[t._v("回复您的评论")]),t._v(" "),n("div",{class:["re_content",e.user_info.replyTemp.comment_content?"":"del"]},[t._v("\n            "+t._s(t._f("fNoComment")(e.user_info.replyTemp.comment_content))+"\n          ")])]),t._v(" "),n("div",{class:["commentContent",e.user_info.comment_content?"":"del"]},[t._v("\n          "+t._s(t._f("fNoComment")(e.user_info.comment_content))+"\n        ")])]):t._e(),t._v(" "),e.info_is_reply_article?n("div",[n("div",{staticClass:"replyComment"},[n("div",[t._v("回复您的文章")]),t._v(" "),n("div",{class:["re_content",e.article_title?"":"del"]},[t._v("\n            "+t._s(t._f("fNoArticle")(e.article_title))+"\n          ")])]),t._v(" "),n("div",{class:["commentContent",e.user_info.comment_content?"":"del"]},[t._v("\n          "+t._s(t._f("fNoComment")(e.user_info.comment_content))+"\n        ")])]):t._e(),t._v(" "),e.info_is_reward?n("div",[n("div",{staticClass:"replyComment"},[n("div",[t._v("土豪打赏您的文章")]),t._v(" "),n("div",{class:["re_content",e.article_title?"":"del"]},[t._v("\n            "+t._s(t._f("fNoArticle")(e.article_title))+"\n          ")])]),t._v(" "),n("div",{staticClass:"commentContentForGold"},[t._v("\n          打赏您的文章"),n("i",{staticClass:"iconfont gold"},[t._v("")]),t._v(" : "+t._s(e.info_reward_num)+"颗\n        ")])]):t._e()],1)}),0)],1)],1)},staticRenderFns:[]};var _=n("VU/8")(l,f,!1,function(t){n("iVN1")},"data-v-09a6074c",null);e.default=_.exports},iVN1:function(t,e){}});
//# sourceMappingURL=18.5d3ec26ab690bbb7cb30.js.map