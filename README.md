# Aotter Assignment SDK
[題目連結](https://github.com/aotter/aotter-assignment-sdk)
- 設計一個 javascript sdk，讓開發者可以在自己的網站頁面中顯示廣告

# 如何開始專案
### Step1. 安裝套件
```
npm install
```

### Step2. 編譯 Aotter Assignment SDK
```
npm run build:webpack
```

### Step3. 啟動網頁服務

```
npm start
```

### Step4. 執行 Selenium 測試

```
# 執行 Selenium 測試 (必須先啟動網頁服務)
npm run test
```

### 在瀏覽器上執行範例網頁
```
http://localhost:3000
```

# 如何使用 SDK
#### 你可以用 `<script>` 腳本呼叫
```
<script src="http://localhost:3000/aotter-assignment-sdk.min.js"></script>

// 腳本執行後，可以取到一個全域變數: window.aotterAssignmentSDK
```
#### 你也可以用模組化標準語法
```
// 編譯出來的 SDK 會在專案中 /dist 目錄底下

const aotterAssignmentSDK = require('dist/aotter-assignment-sdk.min');
```

### 使用 SDK (分別為 `VIDEO`, `BANNER` 兩種廣告類型)
- 以 aotterAssignmentSDK.AdClient 建立實例，選擇網頁上 #aotter-ad-banner 元素做為廣告置入點
- elementID 參數為欲被掛載的網頁元素, type 參數為廣告的型態 (`BANNER` / `VIDEO`)
```
<script>
    var acBanner = new aotterAssignmentSDK.AdClient({
        type: 'BANNER',
        elementID: 'aotter-ad-banner'
    });
</script>
```

- 欲被掛載的網頁元素
```
<div id="aotter-ad-banner"></div>
```

- 監聽事件: 廣告載入成功 `onAdLoaded()`
```
<script>
    acBanner.onAdLoaded(function() {
        console.log('Banner on-ad-loaded.');
    });
</script>
```

- 監聽事件: 廣告載入失敗 `onAdFailed()`
```
<script>
    acBanner.onAdFailed(function() {
        console.log('Banner on-ad-failed.');
    });
</script>
```

- 監聽事件: 廣告出現在畫面上超過 50%至少一秒 `onAdImpression()`
```
<script>
    acBanner.onAdImpression(function() {
        console.log('Banner on-ad-impression.');
    });
</script>
```

# 瀏覽器支援
- The current version of Microsoft Edge (Windows)
- Internet Explorer 10 and 11 (Windows)
- The current and previous version of Firefox (Windows, macOS, Linux)
- The current and previous version of Chrome (Windows, macOS, Linux)
- The current and previous version of Safari (macOS)
