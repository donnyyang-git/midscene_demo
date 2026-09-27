import dotenv from 'dotenv';
dotenv.config();

import { test } from '@playwright/test';
import { PlaywrightAgent } from '@midscene/web/playwright';

test('Midscene AI - 精準語意定位與 Tab 查詢', async ({ page }) => {
  test.setTimeout(360000);

  // 1. 前往台塑網採購公報頁面
  await page.goto('https://www.e-fpg.com.tw/j2sp/prc/prc_anno_gst_srh.jsp?lang=Big5');

  // 2. 初始化 Midscene Agent
  const agent = new PlaywrightAgent(page);

  // 3. 定位「詢價案號:」後方的輸入框並進行 Y 軸偏移補償點擊
  const inputEl = await agent.aiLocate('「詢價案號:」後方的輸入框');

  if (inputEl && inputEl.center) {
    const [x, y] = inputEl.center;
    // 將 Y 座標向上微調 20px，防止 Qwen3.5 點擊點落入框外右下角
    await page.mouse.click(x, y - 20);
  } else {
    // 備用方案：使用更精準的語意填值
    await agent.ai('在「詢價案號:」右側的輸入框輸入 "01-2E0AC3"');
  }

  // 4. 輸入查詢案號
  await agent.ai('輸入 "01-2E0AC3"');

  // 5. 按下 Tab 鍵將焦點移至下一個控制項（即「開始查詢」按鈕）
  await page.keyboard.press('Tab');

  // 6. 按下 Enter 鍵觸發查詢
  await page.keyboard.press('Enter');

  // 7. 等待查詢結果頁面載入
  await page.waitForTimeout(4000);

  // 8. 使用 Midscene aiQuery 擷取結果並轉換為結構化表格
  const searchResults = await agent.aiQuery(
    'Array<{ 詢價案號: string, 採購名稱: string, 申購公司: string, 交貨地: string, 數量和單位: string, 截標日期: string, 狀態: string }>: ' +
    '提取查詢結果表格中的所有案件列表。包含詢價案號、採購名稱、申購公司/事業部、交貨地、數量和單位、截標時間與狀態。若無資料則回傳空陣列 []。'
  );

  // 9. 印出格式化表格
  console.log('\n================ 台塑網 AI 查詢結果 ================');
  if (Array.isArray(searchResults) && searchResults.length > 0) {
    console.table(searchResults);
  } else {
    console.log('查詢結果資料內容：', searchResults);
  }
  console.log('====================================================\n');
});