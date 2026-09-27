import dotenv from 'dotenv';
dotenv.config();

import { test, expect } from '@playwright/test';
import { PlaywrightAgent } from '@midscene/web/playwright';

test('使用 Midscene AI 操作網頁', async ({ page }) => {
  test.setTimeout(360000);

  // 1. 開啟目標網頁
  //await page.goto('https://www.google.com');
  await page.goto('https://www.bing.com');

  // 2. 用 Playwright 原生指令快速處理 Cookie 彈窗 (相容各國語言按鈕與滾動)
  try {
    // Google 的 Accept all 按鈕常見的 id 或文字匹配
    const acceptBtn = page.locator('button:has-text("Accept all"), button:has-text("Acceptă tot"), #L2AGLb');
    if (await acceptBtn.isVisible({ timeout: 3000 })) {
      await acceptBtn.click();
      await page.waitForTimeout(1000); // 等待彈窗消失
    }
  } catch (e) {
    console.log('未偵測到 Cookie 彈窗，繼續執行');
  }

  // 3. 建立 Midscene Agent 實例
  const agent = new PlaywrightAgent(page);

  // 4. 讓 AI 執行核心測試邏輯
  await agent.ai('在搜尋框輸入 "Playwright" 並按下 Enter');
  

  // 5. 斷言與資料提取
  await agent.aiAssert('搜尋結果頁面中應包含與 Playwright 相關的連結');

  const firstResultTitle = await agent.aiQuery('string: 提取搜尋結果中第一個標題的文字內容');
  console.log('第一個搜尋結果標題為：', firstResultTitle);
});