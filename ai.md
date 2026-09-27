在 VS Code 中結合 **Playwright** 與 **Midscene.js**（原語意推測為基於 AI 視覺驅動的自動化工具 Midscene.js），可以實現使用自然語言（如「點擊登入按鈕」、「輸入使用者名稱」）來驅動瀏覽器自動化測試。

以下是在 VS Code 中設定並使用的完整教學：

---

### Step 1: 環境準備與專案初始化

1. **開啟 VS Code**，建立一個新資料夾並開啟終端機（`Ctrl + ~` 或 `Cmd + ~`）。
2. **初始化 Playwright 專案**：
```bash
npm init playwright@latest

```


> 過程中的選項選 JavaScript 或 TypeScript 均可（建議選擇預設選項）。


3. **安裝 Midscene.js 的 Playwright 整合包**：
```bash
npm i @midscene/web --save-dev

```


4. **設定 API Key**：
Midscene 需要呼叫大語言模型（如 OpenAI 或其他支援 Vision 的模型）。請在專案根目錄建立 `.env` 檔案並填入你的金鑰：
```env
OPENAI_API_KEY="your-openai-api-key"

```



---

### Step 2: 撰寫測試腳本

在 `tests/` 資料夾下新建一個測試檔案（例如 `example.spec.js`），將 Playwright 與 Midscene 結合：

```javascript
const { test, expect } = require('@playwright/test');
const { PlaywrightAgent } = require('@midscene/web');

test('使用 Midscene AI 操作網頁', async ({ page }) => {
  // 1. 開啟目標網頁
  await page.goto('https://www.google.com');

  // 2. 初始化 Midscene Agent
  const agent = new PlaywrightAgent(page);

  // 3. 使用自然語言執行指令 (.ai)
  await agent.ai('在搜尋框輸入 "Playwright" 並按下 Enter');

  // 4. 等待載入並使用自然語言斷言 (.aiAssert)
  await agent.aiAssert('搜尋結果頁面中應包含與 Playwright 相關的連結');

  // 5. 提取頁面資料 (.aiQuery)
  const firstResultTitle = await agent.aiQuery('提取搜尋結果中第一條標題的文字內容');
  console.log('第一個搜尋結果標題為：', firstResultTitle);
});

```

---

### Step 3: 在 VS Code 中執行與除錯

#### 方法一：使用 CLI 終端機執行

在 VS Code 終端機輸入：

```bash
npx playwright test --headed

```

* `--headed` 參數可以在執行時跳出實體瀏覽器視窗，方便觀察 AI 的操作步驟。

#### 方法二：使用 Playwright 官方 VS Code 擴充套件

1. 在 VS Code 擴充功能商店搜尋並安裝 **Playwright Test for VS Code**。
2. 安裝後，開啟 `example.spec.js`，程式碼行號旁會出現綠色的播放按鈕（`▶`）。
3. 點擊綠色按鈕即可單步執行或調試該筆測試。

---

### Step 4: 檢視執行報告

Midscene 執行完畢後會自動將 AI 視覺分析與步驟記錄生成為 HTML 報告：

1. 執行完畢後，終端機會輸出報告路徑（通常位於 `./midscene_run/report/`）。
2. 在 VS Code 檔案樹中找到該 HTML 檔案，右鍵點擊並選擇 **Open with Live Server**（若有安裝該 Extension）或直接在瀏覽器中開啟該檔案，即可查看直觀的 AI 動作分解圖。