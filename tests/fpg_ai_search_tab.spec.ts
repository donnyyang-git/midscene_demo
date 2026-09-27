import dotenv from 'dotenv';
dotenv.config();

import { test } from '@playwright/test';
import { PlaywrightAgent } from '@midscene/web/playwright';

test('Midscene AI - 座標補償精準點擊輸入框並查詢', async ({ page }) => {
  test.setTimeout(360000);

  // 1. 開啟台塑網採購公報頁面
  await page.goto('https://www.e-fpg.com.tw/j2sp/prc/prc_anno_gst_srh.jsp?lang=Big5');

  // 2. 初始化 Midscene Agent
  const agent = new PlaywrightAgent(page);

  // 3. 使用 Midscene 的 aiLocate 獲取 AI 識別出的輸入框元素座標資訊
  const targetElement = await agent.aiLocate('詢價案號右側的白底輸入框');

  if (targetElement && targetElement.center) {
    const [x, y] = targetElement.center;
    // 解決 Qwen3.5 視覺邊界框偏下問題：將 Y 座標向上偏移 20 像素，精準落入輸入框內部
    await page.mouse.click(x, y - 20);
  } else {
    // 備用：若 locate 失敗則直接下達點擊指令
    await agent.ai('點擊「詢價案號:」右側的輸入框');
  }

  // 4. 輸入單號並按下 Enter 觸發查詢
  await agent.ai('輸入 "01-2E0AC3"');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  // 5. 等待查詢結果頁面載入
  await page.waitForTimeout(4000);

  // 6. 使用 Midscene aiQuery 抓取結果頁面並整理成結構化 JSON 陣列
  const searchResults = await agent.aiQuery(
    'Array<{ 詢價案號: string, 採購名稱: string, 申購公司: string, 截標日期: string, 狀態: string }>: ' +
    '提取查詢結果表格中的所有案件列表。包含詢價案號、採購名稱、申購公司/事業部、截標時間與狀態。若無資料則回傳空陣列 []。'
  );

  // 7. 將結果印出成 Console 表格
  console.log('\n================ 台塑網 AI 查詢結果 ================');
  if (Array.isArray(searchResults) && searchResults.length > 0) {
    console.table(searchResults);
  } else {
    console.log('查詢結果資料內容：', searchResults);
  }
  console.log('====================================================\n');
});