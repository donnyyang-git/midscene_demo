import dotenv from 'dotenv';
dotenv.config();

import { test, expect } from '@playwright/test';
import { PlaywrightAgent } from '@midscene/web/playwright';

test('台塑網採購公報詢價案號查詢與資料表格化', async ({ page }) => {
  test.setTimeout(90000);

  // 1. 前往台塑網採購公報頁面
  await page.goto('https://www.e-fpg.com.tw/j2sp/prc/prc_anno_gst_srh.jsp?lang=Big5');

  // 2. 用 Playwright 精準定位輸入框與按鈕並執行操作
  // 輸入詢價案號
  await page.locator('input[type="text"]').first().fill('01-2E0AC3');
  
  // 點擊「開始查詢」按鈕 (透過按鈕文字或 input[type="button"] 精準點擊)
  await page.locator('input[value*="開始查詢"], button:has-text("開始查詢")').first().click();

  // 3. 等待頁面跳轉與資料載入
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // 4. 初始化 Midscene Agent 並擷取資料
  const agent = new PlaywrightAgent(page);

  // 5. 使用 aiQuery 將查詢結果頁面轉換為 JSON 表格
  const searchResults = await agent.aiQuery(
    'Array<{ 詢價案號: string, 採購名稱: string, 申購公司: string, 截標日期: string, 狀態: string }>: ' +
    '提取查詢結果表格中的所有資料列表。包含詢價案號、採購名稱/主題、申購公司、截標時間等欄位。若無資料則回傳空陣列。'
  );

  // 6. 印出格式化表格
  console.log('\n================ 台塑網查詢結果 ================');
  if (Array.isArray(searchResults) && searchResults.length > 0) {
    console.table(searchResults);
  } else {
    console.log('查詢結果資料內容：', searchResults);
  }
  console.log('================================================\n');
});