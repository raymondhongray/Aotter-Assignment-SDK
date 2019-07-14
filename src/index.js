import 'whatwg-fetch';
import 'events-polyfill'
import 'ie-array-find-polyfill';
import 'es6-promise/auto';

const host = 'http://localhost:3000';

class Emitter {
  constructor() {
    const delegate = document.createDocumentFragment();
    [
      'addEventListener',
      'dispatchEvent',
      'removeEventListener'
    ].forEach(f =>
      this[f] = (...xs) => delegate[f](...xs)
    )
  }
}

// IE doesn't support EventTarget
class AdEventTarget extends Emitter {
  onAdLoaded() {
    this.dispatchEvent(new Event('on-ad-loaded'));
  }
  onAdFailed() {
    this.dispatchEvent(new Event('on-ad-failed'));
  }
  onAdImpression() {
    this.dispatchEvent(new Event('on-ad-impression'));
  }
}

export class AdClient {
  static events = [];
  constructor({ elementID = '', type = '' }) {
    console.log('AdClient init.');
    this.elementID = elementID;
    this.event = new AdEventTarget();
    showIframe.bind(this)(type);
  }
  static getAdEventByIframeID(IframeID) {
    return AdClient.events.find((element) => IframeID === element.IframeID);
    ;
  }
  static addNewEvent(IframeID, event) {
    AdClient.events.push({
      IframeID,
      event
    });
  }
  echo(str) {
    console.log(str);
  }
  onAdLoaded(cb) {
    this.event.addEventListener('on-ad-loaded', (e) => {
      cb();
    });
  }
  onAdFailed(cb) {
    this.event.addEventListener('on-ad-failed', (e) => {
      cb();
    });
  }
  onAdImpression(cb) {
    this.event.addEventListener('on-ad-impression', (e) => {
      cb();
    });
  }
}

function showIframe(type) {
  if (this.elementID === '' || typeof this.elementID !== 'string') {
    throw new Error('Invaild elementID.');
  }
  type = type.toLowerCase();
  if (type !== 'banner' && type !== 'video') {
    throw new Error('Invaild Ad type.');
  }

  const url = `${host}/ads?type=${type}`;
  fetch(url, {
    method: 'GET',
    headers: {
      'Origin': document.baseURI
    }
  })
  .then(response => response.json())
  .then((data) => {
    if (data.success === true) {
      this.event.onAdLoaded();
    } else {
      this.event.onAdFailed();
      const aotterAdElement = document.getElementById(this.elementID);
      const divNode = document.createElement('div');
      divNode.style.background = '#d9d9d9';
      divNode.style.border = '5px solid #fff';
      divNode.style.textAlign = 'center';
      divNode.style.lineHeight = '100px';
      divNode.textContent = '404 OOPS! aotter-Ad not found!';
      aotterAdElement.appendChild(divNode);
      return;
    }
    const aotterAdElement = document.getElementById(this.elementID);
    const iframeNode = document.createElement('iframe');
    const iframeID = `ifrm-${+new Date()}`;
    AdClient.addNewEvent(iframeID, this.event);

    iframeNode.setAttribute('id', iframeID);
    iframeNode.setAttribute('src', `${host}/iframe_api?` +
    `iframeID=${encodeURIComponent(iframeID)}&` +
    `adType=${encodeURIComponent(type)}&` +
    `title=${encodeURIComponent(data.title)}&` +
    `description=${encodeURIComponent(data.description)}&` +
    `imgSrc=${encodeURIComponent(data.image)}&` +
    `href=${encodeURIComponent(type === 'video' ? data.video_url : data.url)}&` +
    `impressionUrl=${encodeURIComponent(data.impression_url)}`);

    iframeNode.setAttribute('width', '100%');
    iframeNode.setAttribute('scrolling', 'no');
    iframeNode.onload = () => {
      // 如果想往 iframe 傳遞資料，可以寫在這裡
    };
    aotterAdElement.appendChild(iframeNode);
  })
  .catch(error => {
    this.event.onAdFailed();
    console.error(error);
  });
}

// 註冊訊息事件監聽，對來自 iframe 框架的訊息進行處理
window.addEventListener('message', function(e) {
  if (e.data.act === 'response') {
    const {
      iframeID,
      completedPercentage,
      moreThanHalfCompleted,
      impressionUrl
    } = e.data.msg;
    if (moreThanHalfCompleted) {
      this.setTimeout(() => {
        // 當廣告出現在畫面中，超過50%持續一秒時，呼叫這個端點 impressionUrl
        const url = `${host}/call?url=${encodeURIComponent(impressionUrl)}`
        fetch(url, {
          method: 'GET'
        })
        .then(response => response.json())
        .then((data)=> {
          if (data.success === true) {
            const { event } = AdClient.getAdEventByIframeID(iframeID);
            event.onAdImpression();
          }
        })
        .catch(error => {
          console.error(error);
        });
      }, 1000)
    }
  } else if (e.data.act === 'resize') {
    const {
      iframeID,
      height
    } = e.data.msg;
    document.getElementById(iframeID).height = height;
  } else {
    console.log('未定義的訊息: '+ e.data.act);
  }
}, false);
