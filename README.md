# midscene_demo

這是一個結合 **Playwright** 與 **Midscene** (AI 驅動) 的自動化測試/自動化操作專案。透過 AI 語意理解，可以更直覺地進行網頁元素定位與自動化流程測試。

## 🚀 快速開始

### 1. 環境需求
請確保本地環境已安裝 [Node.js](https://nodejs.org) (建議 v18 以上)。

### 2. 安裝步驟
複製此專案到本地後，在終端機執行以下指令安裝相關依賴套件：

```bash
# 安裝專案所需套件
npm install

# 安裝 Playwright 瀏覽器核心
npx playwright install
```

### 3. 設定環境變數
專案中包含 `.env` 需求（例如 OpenAI API Key 或其他 AI 模型金鑰）。請在本地專案根目錄建立 `.env` 檔案並填入必要資訊：

```text
OPENAI_API_KEY=your_api_key_here
```
*(注意：`.env` 已加入 `.gitignore`，請勿上傳至遠端儲存庫)*

## 🛠 執行測試與指令

專案內建支援 Midscene 視覺化與腳本執行：

* **執行自動化腳本 / 測試**：
  ```bash
  npx playwright test
  ```

* **開啟 Midscene 互動式遊樂場 (Playground)**：
  ```bash
  npx midscene
  ```

## 📁 專案結構說明

* `tests/` - 存放 Playwright / Midscene 的自動化測試腳本。
* `playwright.config.ts` - Playwright 自動化框架的核心設定檔。
* `playground.md` / `ai.md` / `do.md` - Midscene AI 實驗與操作指令紀錄。
* `package.json` - 專案套件設定與腳本定義。
