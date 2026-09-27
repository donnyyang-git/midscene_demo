import { test, expect } from '@playwright/test';
import { PlaywrightWebAgent } from '@midscene/web';

test('使用 Midscene AI 操作網頁', async ({ page }) => {
  // 1. 開啟目標網頁
  await page.goto('https://www.google.com');

  // 2. 初始化 Playwright 專用的 Agent 實例
  const agent = new PlaywrightWebAgent(page);

  // 3. 使用自然語言執行指令
  await agent.ai('在搜尋框輸入 "Playwright" 並按下 Enter');

  // 4. 等待載入並使用自然語言斷言
  await agent.aiAssert('搜尋結果頁面中應包含與 Playwright 相關的連結');

  // 5. 提取頁面資料
  const firstResultTitle = await agent.aiQuery('string: 提取搜尋結果中第一個標題的文字內容');
  console.log('第一個搜尋結果標題為：', firstResultTitle);
});