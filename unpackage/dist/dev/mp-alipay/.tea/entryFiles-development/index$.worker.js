/**! __APPX-TRACE_START__ */ 
      !(function() {
        false && console.log('APPXTRACE INJECT');
        const GLOBAL =  typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : new Function('return this')();
        GLOBAL.__traceStartupParams={"env":"simulator","biz":"performance"};
      }());
      !function(){"use strict";
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */var t=function(){return(t=Object.assign||function(t){for(var a,n=1,e=arguments.length;n<e;n++)for(var r in a=arguments[n])Object.prototype.hasOwnProperty.call(a,r)&&(t[r]=a[r]);return t}).apply(this,arguments)};function a(){for(var t=0,a=0,n=arguments.length;a<n;a++)t+=arguments[a].length;var e=Array(t),r=0;for(a=0;a<n;a++)for(var o=arguments[a],i=0,_=o.length;i<_;i++,r++)e[r]=o[i];return e}var n=null;try{n||(n="undefined"!=typeof window?window:"undefined"!=typeof self?self:"undefined"!=typeof globalThis?globalThis:new Function("return this")())}catch(t){console.log(t)}var e=n,r=Date.now(),o="undefined"!=typeof __traceStartupParams?__traceStartupParams:e.__traceStartupParams?e.__traceStartupParams:{},i={scriptTimeBegin:r,global:e,startupParams:t(t({},{env:"device",biz:"performance"}),o),hook:{},appx:{}},_=i.global,f=i.startupParams,l=f.biz;if("simulator"===f.env);else if("performance"===l)if(null==_?void 0:_.__APPX_DEVTOOLS_GLOBAL_HOOK__){var p=_.__APPX_DEVTOOLS_GLOBAL_HOOK__.onSetData;_.__APPX_DEVTOOLS_GLOBAL_HOOK__.onSetData=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];u.apply(void 0,a([i.hook.onSetData],t)),"function"==typeof p&&p.apply(void 0,t)}}else _.__APPX_DEVTOOLS_GLOBAL_HOOK__={onSetData:function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];u.apply(void 0,a([i.hook.onSetData],t))}};function u(t){for(var a=[],n=1;n<arguments.length;n++)a[n-1]=arguments[n];if("function"==typeof t)return t.apply(void 0,a)}}();

       /**! __APPX-TRACE_END__ */
if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');
require('./importScripts$');

      function getUserAgentInPlatformWeb() {
        return typeof navigator !== 'undefined' ? navigator.swuserAgent || navigator.userAgent || '' : '';
      }
      if(getUserAgentInPlatformWeb() && (getUserAgentInPlatformWeb().indexOf('LyraVM') > 0 || getUserAgentInPlatformWeb().indexOf('AlipayIDE') > 0) ) {
        var AFAppX = self.AFAppX.getAppContext ? self.AFAppX.getAppContext().AFAppX : self.AFAppX;
      } else {
        importScripts('https://appx/af-appx.worker.min.js');
        var AFAppX = self.AFAppX;
      }
      self.getCurrentPages = AFAppX.getCurrentPages;
      self.getApp = AFAppX.getApp;
      self.Page = AFAppX.Page;
      self.App = AFAppX.App;
      self.my = AFAppX.bridge || AFAppX.abridge;
      self.abridge = self.my;
      self.Component = AFAppX.WorkerComponent || function(){};
      self.$global = AFAppX.$global;
      self.requirePlugin = AFAppX.requirePlugin;
    

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../components/uni-icons/uni-icons?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/navbar/navbar?hash=4f3f44db986be84bb3e7c699e0f2fdbffe19a890');
require('../../components/tab/tab?hash=4f3f44db986be84bb3e7c699e0f2fdbffe19a890');
require('../../components/list-scroll/list-scroll?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/likes/likes?hash=4f3f44db986be84bb3e7c699e0f2fdbffe19a890');
require('../../components/list-card/list-card?hash=e0f2a6dc341f22d810f5b93bc1eb28d2ba77e03a');
require('../../components/uni-load-more/uni-load-more?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/list/list-item?hash=64373c8b984b5f2912e9ec5df0f91642808ac94a');
require('../../components/list/list?hash=97a3f0b49d18befee70a599d5f62115682226a62');
require('../../components/list-author/list-author?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/comments-box/comments-box?hash=80fdd31908135e0c8080c03c9bb073f96011233e');
require('../../components/uni-transition/uni-transition?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/uni-popup/uni-popup?hash=63f3d097e78ac04213190ce4a92c81860617f7b4');
require('../../components/popup/popup?hash=e7f45238e4569450c099d45b453b1d838086cc09');
require('../../components/gaoyia-parse/components/wxParseImg?hash=591ac642b6f57a184fac9330fa292ccf33c32471');
require('../../components/gaoyia-parse/components/wxParseVideo?hash=591ac642b6f57a184fac9330fa292ccf33c32471');
require('../../components/gaoyia-parse/components/wxParseAudio?hash=591ac642b6f57a184fac9330fa292ccf33c32471');
require('../../components/gaoyia-parse/components/wxParseTable?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/gaoyia-parse/components/wxParseTemplate11?hash=a361c7ac70b2787bb4f6403e4c358d47459fda55');
require('../../components/gaoyia-parse/components/wxParseTemplate10?hash=6c4e9abbffbecad61906e6dc41748b4d59f45350');
require('../../components/gaoyia-parse/components/wxParseTemplate9?hash=c9057e49060debe052702330528fc94e4b9b60ec');
require('../../components/gaoyia-parse/components/wxParseTemplate8?hash=2ce376d0bfc8ab3b633b1b0572cbd15e139d65e0');
require('../../components/gaoyia-parse/components/wxParseTemplate7?hash=317daab1ac18eb06d5a0a23df6bce19633f5c70a');
require('../../components/gaoyia-parse/components/wxParseTemplate6?hash=ba6ed979d4307e5d23e8ca1eba1d3b2961802024');
require('../../components/gaoyia-parse/components/wxParseTemplate5?hash=d2cf2f62b014565845ccb6840f14ce4451c5d8d1');
require('../../components/gaoyia-parse/components/wxParseTemplate4?hash=0b50ca34a01d9058789fe579fd3f94be1995b2e2');
require('../../components/gaoyia-parse/components/wxParseTemplate3?hash=bd2ada6053b65761b2f5af702556f9965413b241');
require('../../components/gaoyia-parse/components/wxParseTemplate2?hash=95c942216591538e03a0e8c7f6a230cd28ee9fdb');
require('../../components/gaoyia-parse/components/wxParseTemplate1?hash=f3b709744e77e1929ebad2bdd986ffe1c677bb07');
require('../../components/gaoyia-parse/components/wxParseTemplate0?hash=c0769a429d7e44d1639efe4cc1dbe15185cbf634');
require('../../components/gaoyia-parse/parse?hash=dedbcb6e82c26b76fab92362d643f5fc6465c464');
require('../../pages/tabbar/index/index?hash=d593c0804300b2ff6280a20e9008c0df4e97c9a8');
require('../../pages/tabbar/follow/follow?hash=77e4f29cd7e369fe8abada5811e00514a74d6bff');
require('../../pages/tabbar/my/my?hash=af30089a14de5bba22f51cbb6b3d48bc536087f6');
require('../../pages/home-search/home-search?hash=b0a4f2af547289e4cccb05ef0f7a985a6981632c');
require('../../pages/home-label/home-label?hash=0cc0efa7d622664baeb3a4df7a801da917807a32');
require('../../pages/home-detail/home-detail?hash=8dfe2d9013baf1c4668d5e04ac38f8fa422ac55d');
require('../../pages/detail-comments/detail-comments?hash=4145ad3a7197ee9f095850c30f9571386bc25d7f');
require('../../pages/my-article/my-article?hash=d5be99bbecb466a7e65c726c3d5f6ea5f929a227');
require('../../pages/feedback/feedback?hash=af30089a14de5bba22f51cbb6b3d48bc536087f6');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}