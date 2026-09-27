import dotenv from 'dotenv';
dotenv.config();

import { test } from '@playwright/test';
import { PlaywrightAgent } from '@midscene/web/playwright';

test('全 Midscene AI 精準點擊輸入框並查詢台塑網', async ({ page }) => {
  test.setTimeout(120000);

  // 1. 開啟台塑網採購公報頁面
  await page.goto('https://www.e-fpg.com.tw/j2sp/prc/prc_anno_gst_srh.jsp?lang=Big5');

  // 2. 初始化 Midscene Agent
  const agent = new PlaywrightAgent(page);

  // 3. 步驟一：精確定位並點擊輸入框（強調白色輸入區域內部）
  // 使用顯著的視覺標籤：白色背景、黑色邊框、輸入框內部
  //await agent.ai('點擊「詢價案號:」標籤正右側的白色長方形文字輸入框區域內部');
  await agent.ai('點擊 name 或 id 為 input 類型的第一個白底輸入框');
  //await agent.ai('點擊「詢價案號:」右邊、寫著「開始查詢」左邊的白色輸入框正中間');

  // 4. 步驟二：輸入查詢案號
  await agent.ai('在當前聚焦的輸入框中輸入 "01-2E0AC3"');
  

  // 5. 步驟三：按下 Enter 鍵觸發查詢（避免 AI 點擊按鈕偏離）
  await agent.ai('按下 Enter 鍵');

  // 6. 等待查詢結果頁面載入
  await page.waitForTimeout(4000);

  // 7. 使用 aiQuery 提取查詢結果頁面的資料並整理成 JSON 結構化表格
  const searchResults = await agent.aiQuery(
    'Array<{ 詢價案號: string, 採購名稱: string, 申購公司: string, 截標日期: string, 狀態: string }>: ' +
    '提取查詢結果表格中的所有案件列表。包含詢價案號、採購名稱、申購公司/事業部、截標時間與狀態。若無資料則回傳空陣列 []。'
  );

  // 8. 印出格式化表格
  console.log('\n================ 台塑網 AI 查詢結果 ================');
  if (Array.isArray(searchResults) && searchResults.length > 0) {
    console.table(searchResults);
  } else {
    console.log('查詢結果資料內容：', searchResults);
  }
  console.log('====================================================\n');
});