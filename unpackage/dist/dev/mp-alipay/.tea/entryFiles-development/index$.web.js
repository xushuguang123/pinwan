/**! __APPX-TRACE_START__ */ (function () {
  function init() {
    if (window.AlipayJSBridge) {
      replaceBridgeCall();
      // 注册invokeTraceDebugJsEvent监听
      registerTraceDebugJsCollectEvent();
    } else {
      document.addEventListener(
        'AlipayJSBridgeReady',
        () => {
          replaceBridgeCall();
          // 注册invokeTraceDebugJsEvent监听
          registerTraceDebugJsCollectEvent();
        },
        false,
      );
    }
  }

  function replaceBridgeCall() {
    const traceDebugJsCall = window.AlipayJSBridge.call;
    window.AlipayJSBridge.call = function (method, param, done) {
      if (method === 'onAppPerfEvent') {
        if (param && param.state && param.state === 'pageLoaded') {
          sendTraceDebugJsCollectEvent();
        }
      } else if (method === 'internalAPI' && param.method && param.method === 'onAppPerfEvent') {
        if (param.param && param.param.state && param.param.state === 'pageLoaded') {
          sendTraceDebugJsCollectEvent();
        }
      }
      traceDebugJsCall(method, param, done);
    };
  }

  function sendTraceDebugJsCollectEvent() {
    const event = new CustomEvent('traceDebugCollectEvent');
    document.dispatchEvent(event);
  }

  function registerTraceDebugJsCollectEvent() {
    document.addEventListener('traceDebugCollectEvent', e => {
      // 执行&收集&发送trace
      const base_time =
        (e.data && e.data.appxBaseTime) || window.performance.timing.navigationStart;
      const tms = new Date().getTime() - base_time;
      const page = location.href;
      const dom_info = collect_audit_dom();
      AlipayJSBridge.call('postMethodTrace', {
        data: `${'D' + ',DOM' + ','}${tms},${tms},${encodeURIComponent(
          JSON.stringify({
            fromAppxJsCollect: true,
            page,
            domSize: dom_info.size,
            domWidth: dom_info.width.max,
            domDepth: dom_info.depth.max,
          }),
        ).replace(/%20/g, '+')}`,
      });
      const image_infos = collect_audit_image_usage(tms);
      for (let i = 0; i < image_infos.length; i++) {
        AlipayJSBridge.call('postMethodTrace', {
          data: `${'I' + ',SCALE' + ','}${tms},${tms},${encodeURIComponent(
            JSON.stringify({
              fromAppxJsCollect: true,
              url: image_infos[i].src,
              page,
              clientHeight: image_infos[i].clientHeight,
              clientWidth: image_infos[i].clientWidth,
              naturalHeight: image_infos[i].naturalHeight,
              naturalWidth: image_infos[i].naturalWidth,
              devicePixelRatio: window.devicePixelRatio,
            }),
          ).replace(/%20/g, '+')}`,
        });
        if (image_infos[i].isOffScreen) {
          AlipayJSBridge.call('postMethodTrace', {
            data: `${'I' + ',OFFSCREEN' + ','}${tms},${tms},${encodeURIComponent(
              JSON.stringify({
                fromAppxJsCollect: true,
                url: image_infos[i].src,
                page,
              }),
            ).replace(/%20/g, '+')}`,
          });
        }
      }
    });
  }

  function collect_audit_image_usage(tms) {
    function getElementsInDocument(selector) {
      /** @type {Array<Element>} */
      const results = [];

      /** @param {NodeListOf<Element>} nodes */
      const _findAllElements = nodes => {
        for (let i = 0, el; (el = nodes[i]); ++i) {
          if (!selector || el.matches(selector)) {
            results.push(el);
          }
          // If the element has a shadow root, dig deeper.
          if (el.shadowRoot) {
            _findAllElements(el.shadowRoot.querySelectorAll('*'));
          }
        }
      };
      _findAllElements(document.querySelectorAll('*'));

      return results;
    } /** @param {Element} element */
    function getClientRect(element) {
      const clientRect = element.getBoundingClientRect();
      return {
        // manually copy the properties because ClientRect does not JSONify
        top: clientRect.top,
        bottom: clientRect.bottom,
        left: clientRect.left,
        right: clientRect.right,
      };
    }
    return (function () {
      const page = location.href;
      /** @type {Array<Element>} */
      // @ts-ignore - added by getElementsInDocumentFnString
      const allElements = getElementsInDocument();
      // Chrome normalizes background image style from getComputedStyle to be an absolute AntUrl in quotes.
      // Only match basic background-image: url("http://host/image.jpeg") declarations
      const CSS_URL_REGEX = /^url\("?([^"]+)"?\)$/;
      // Only find images that aren't specifically scaled
      const CSS_SIZE_REGEX = /(auto|contain|cover)/;

      const images = new Array();

      function fetch_image_info(images, allElements, i) {
        const element = allElements[i];
        const style = window.getComputedStyle(element);
        const imageMatch = style.backgroundImage.match(CSS_URL_REGEX);
        const imgsrc = element.currentSrc || (imageMatch && imageMatch[1]);
        let image;
        if (element.localName === 'img') {
          image = {
            // currentSrc used over src to get the url as determined by the browser
            // after taking into account srcset/media/sizes/etc.
            src: imgsrc,
            width: parseInt(style.width),
            height: parseInt(style.height),
            clientWidth: element.clientWidth,
            clientHeight: element.clientHeight,
            clientRect: getClientRect(element),
            naturalWidth: element.naturalWidth,
            naturalHeight: element.naturalHeight,
            isCss: false,
            isPicture: !!element.parentElement && element.parentElement.tagName === 'PICTURE',
            usesObjectFit:
              style.getPropertyValue('object-fit') === 'cover' ||
              style.getPropertyValue('object-fit') === 'contain',
            isOffScreen: getClientRect(element).top >= window.innerHeight,
          };
        } else {
          if (
            !style.backgroundImage ||
            !CSS_URL_REGEX.test(style.backgroundImage) ||
            !style.backgroundSize ||
            CSS_SIZE_REGEX.test(style.backgroundSize)
          ) {
            return;
          }
          const img = new Image();
          img.onload = function () {
            if (element.clientWidth > 0 && element.clientHeight > 0) {
              console.log(`img style: ${imgsrc}`);
              AlipayJSBridge.call('postMethodTrace', {
                data: `${'I' + ',SCALE' + ','}${tms},${tms},${encodeURIComponent(
                  JSON.stringify({
                    fromAppxJsCollect: true,
                    url: imgsrc,
                    page,
                    clientHeight: element.clientHeight,
                    clientWidth: element.clientWidth,
                    naturalHeight: img.naturalHeight,
                    naturalWidth: img.naturalWidth,
                    devicePixelRatio: window.devicePixelRatio,
                  }),
                ).replace(/%20/g, '+')}`,
              });
            }
            if (getClientRect(element).top >= window.innerHeight) {
              AlipayJSBridge.call('postMethodTrace', {
                data: `${'I' + ',OFFSCREEN' + ','}${tms},${tms},${encodeURIComponent(
                  JSON.stringify({
                    fromAppxJsCollect: true,
                    url: imgsrc,
                    page,
                  }),
                ).replace(/%20/g, '+')}`,
              });
            }
          };
          img.src = imgsrc;
          return;
        }
        if (image && image.clientWidth > 0 && image.clientHeight > 0) {
          console.log(`img: ${image.src}`);
          console.log(`img: ${image.naturalWidth}`);
          console.log(`img: ${image.naturalHeight}`);
          images.push(image);
        }
      }

      for (let i = 0; i < allElements.length; i++) {
        fetch_image_info(images, allElements, i);
      }
      return images;
    })();
  }

  function collect_audit_dom() {
    function getOuterHTMLSnippet(element) {
      const reOpeningTag = /^.*?>/;
      const match = element.outerHTML.match(reOpeningTag);
      return match && match[0];
    }
    function createSelectorsLabel(element) {
      let name = element.localName || '';
      const idAttr = element.getAttribute && element.getAttribute('id');
      if (idAttr) {
        name += `#${idAttr}`;
      }
      // svg elements return SVGAnimatedString for .className, which is an object.
      // Stringify classList instead.
      if (element.classList) {
        const className = element.classList.toString();
        if (className) {
          name += `.${className.trim().replace(/\s+/g, '.')}`;
        }
      } else if (ShadowRoot.prototype.isPrototypeOf(element)) {
        name += '#shadow-root';
      }

      return name;
    }
    function elementPathInDOM(element) {
      const visited = new Set();
      const path = [createSelectorsLabel(element)];
      let node = element;
      while (node) {
        visited.add(node);

        // Anchor elements have a .host property. Be sure we've found a shadow root
        // host and not an anchor.
        if (ShadowRoot.prototype.isPrototypeOf(node)) {
          const isShadowHost = node.host && node.localName !== 'a';
          node = isShadowHost ? node.host : node.parentElement;
        } else {
          const isShadowHost =
            node.parentNode && node.parentNode.host && node.parentNode.localName !== 'a';
          node = isShadowHost ? node.parentNode.host : node.parentElement;
        }

        if (visited.has(node)) {
          node = null;
        }

        if (node) {
          path.unshift(createSelectorsLabel(node));
        }
      }
      return path;
    }
    return (function getDOMStats(element, deep = true) {
      let deepestNode = null;
      let maxDepth = 0;
      let maxWidth = 0;
      let parentWithMostChildren = null;

      /**
       * @param {Element} element
       * @param {number} depth
       */
      const _calcDOMWidthAndHeight = function (element, depth = 1) {
        if (depth > maxDepth) {
          deepestNode = element;
          maxDepth = depth;
        }
        if (element.children.length > maxWidth) {
          parentWithMostChildren = element;
          maxWidth = element.children.length;
        }

        let child = element.firstElementChild;
        while (child) {
          _calcDOMWidthAndHeight(child, depth + 1);
          // If node has shadow dom, traverse into that tree.
          if (deep && child.shadowRoot) {
            _calcDOMWidthAndHeight(child.shadowRoot, depth + 1);
          }
          child = child.nextElementSibling;
        }

        return { maxDepth, maxWidth };
      };

      const result = _calcDOMWidthAndHeight(element);

      return {
        depth: {
          max: result.maxDepth,
          pathToElement: elementPathInDOM(deepestNode),
          snippet: getOuterHTMLSnippet(deepestNode),
        },
        width: {
          max: result.maxWidth,
          pathToElement: elementPathInDOM(parentWithMostChildren),
          snippet: getOuterHTMLSnippet(parentWithMostChildren),
        },
        size: document.getElementsByTagName('*').length,
      };
    })(document.documentElement);
  }

  init();
})();
 /**! __APPX-TRACE_END__ */
require('@alipay/appx-compiler/lib/sjsEnvInit');
require('./config$');

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
