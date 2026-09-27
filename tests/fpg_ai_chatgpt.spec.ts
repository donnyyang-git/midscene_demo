/**
 * 台塑網採購公報 - 詢價案號自動查詢
 *
 * 技術：
 *   - Playwright Test
 *   - Midscene.js PlaywrightAgent
 *   - dotenv
 *   - TypeScript
 *
 * 功能：
 *   1. 開啟台塑網採購公報查詢頁
 *   2. 使用 Midscene AI 定位「詢價案號」輸入框
 *   3. 取得 AI 定位中心座標
 *   4. Y 座標向上修正 20px
 *   5. 使用 Playwright mouse.click()
 *   6. 輸入指定詢價案號
 *   7. Tab → Enter 觸發查詢
 *   8. 等待查詢結果
 *   9. 使用 Midscene aiQuery 結構化擷取所有案件
 *  10. console.table() 輸出結果
 *
 * 執行：
 *   npx playwright test tests/fpg-prc.spec.ts
 *
 * 或：
 *   npx playwright test tests/fpg-prc.spec.ts --headed
 */

// ============================================================
// 1. Environment
// ============================================================

import 'dotenv/config';

import { test, expect } from '@playwright/test';
import { PlaywrightAgent } from '@midscene/web/playwright';

// ============================================================
// 2. 基本設定
// ============================================================

const TARGET_URL =
  'https://www.e-fpg.com.tw/j2sp/prc/prc_anno_gst_srh.jsp?lang=Big5';

/**
 * 測試目標詢價案號
 *
 * 若之後希望改成 .env：
 *
 *   FPG_QUOTATION_NO=01-2E0AC3
 *
 * 即可透過 process.env.FPG_QUOTATION_NO 取得。
 */
const QUOTATION_NO =
  process.env.FPG_QUOTATION_NO?.trim() || '01-2E0AC3';

/**
 * 測試總 Timeout：
 * 360000 ms = 6 分鐘
 */
const TEST_TIMEOUT = 360000;

// Playwright Test 本身設定 6 分鐘
test.setTimeout(TEST_TIMEOUT);

// ============================================================
// 3. 型別定義
// ============================================================

/**
 * Midscene aiQuery 最終要求的資料結構。
 */
interface ProcurementResult {
  詢價案號: string;
  採購名稱: string;
  申購公司: string;
  交貨地: string;
  數量和單位: string;
  截標日期: string;
  狀態: string;
}

// ============================================================
// 4. 測試案例
// ============================================================

test.describe('台塑網採購公報 - 詢價案號查詢', () => {
  test('查詢指定詢價案號並結構化輸出結果', async ({ page }) => {
    // --------------------------------------------------------
    // A. Playwright 基礎設定
    // --------------------------------------------------------

    await page.setViewportSize({
      width: 1440,
      height: 900,
    });

    // --------------------------------------------------------
    // B. 開啟台塑網採購公報
    // --------------------------------------------------------

    console.log('========================================');
    console.log('台塑網採購公報自動化查詢');
    console.log('========================================');
    console.log(`目標網址：${TARGET_URL}`);
    console.log(`詢價案號：${QUOTATION_NO}`);
    console.log('');

    await page.goto(TARGET_URL, {
      waitUntil: 'domcontentloaded',
      timeout: TEST_TIMEOUT,
    });

    // --------------------------------------------------------
    // C. 初始化 Midscene PlaywrightAgent
    // --------------------------------------------------------

    /**
     * PlaywrightAgent 綁定目前 Playwright Page。
     *
     * Midscene 官方支援：
     *
     *   const agent = new PlaywrightAgent(page);
     *
     * 後續即可使用：
     *
     *   agent.aiLocate()
     *   agent.aiAct()
     *   agent.aiQuery()
     *
     * 等 AI 操作 API。
     */
    const agent = new PlaywrightAgent(page, {
      // 保持導覽在目前 Page
      forceSameTabNavigation: true,

      // 每次 AI action 後最多等待網路閒置
      waitForNetworkIdleTimeout: 2000,
    });

    try {
      // ------------------------------------------------------
      // D. 等待頁面初步穩定
      // ------------------------------------------------------

      await page.waitForTimeout(2000);

      // ======================================================
      // E. AI Locate
      // ======================================================

      console.log('----------------------------------------');
      console.log('[1] 使用 Midscene AI 定位詢價案號輸入框');

      /**
       * 核心 AI 定位提示詞。
       *
       * 注意：
       * 不直接叫 AI 點擊。
       *
       * 先讓 AI 找出元素位置，再由我們自己控制
       * 最終 click 座標。
       */
      const locatePrompt =
        '定位「詢價案號:」後方的輸入框。' +
        '請找到實際可以輸入詢價案號的文字輸入框。';

      let locateResult:
        | {
            rect: {
              left: number;
              top: number;
              width: number;
              height: number;
            };
            center: [number, number];
            dpr?: number;
          }
        | undefined;

      // ------------------------------------------------------
      // F. AI Locate + 座標容錯
      // ------------------------------------------------------

      try {
        locateResult = await agent.aiLocate(locatePrompt);

        console.log('AI Locate 結果：');
        console.log(JSON.stringify(locateResult, null, 2));

        if (
          !locateResult ||
          !locateResult.center ||
          locateResult.center.length !== 2
        ) {
          throw new Error('AI Locate 沒有回傳有效 center 座標');
        }

        const [centerX, centerY] = locateResult.center;

        /**
         * ====================================================
         * 重要容錯：
         *
         * Qwen 等 Vision LLM 有可能把輸入框定位到：
         *
         *       ┌───────────────────┐
         *       │                   │
         *       │       INPUT       │
         *       │                   │
         *       └───────────────────┘
         *                    ●
         *
         *       AI 點在右下邊界附近
         *
         * 因此不要完全相信 AI 回傳的 Y 座標。
         *
         * 將 Y 軸向上修正 20 px：
         *
         *       correctedY = centerY - 20
         *
         * X 維持 AI 定位的中心 X。
         * ====================================================
         */

        const correctedX = centerX;
        //const correctedY = centerY - 20;
        const correctedY = centerY ;

        console.log(
          `AI 中心座標：(${centerX}, ${centerY})`,
        );

        console.log(
          `修正後座標：(${correctedX}, ${correctedY})`,
        );

        console.log(
          '執行 Playwright page.mouse.click()...',
        );

        await page.mouse.click(
          correctedX,
          correctedY,
        );

        console.log('✓ AI 座標修正點擊完成');
      } catch (locateError) {
        // ====================================================
        // G. AI Locate 失敗 → 備用 AI 操作
        // ====================================================

        console.warn('');
        console.warn(
          '⚠ AI 座標定位或點擊失敗，啟動備用方案。',
        );

        console.warn(
          '錯誤：',
          locateError,
        );

        /**
         * 使用使用者指定的「單行 AI 備份提示詞」。
         *
         * 這裡刻意不再自行拆解 click / input，
         * 讓 Midscene 自己完成這個動作。
         */
        const fallbackPrompt =
          `在「詢價案號:」右側的輸入框輸入 '${QUOTATION_NO}'`;

        console.log(
          `執行備用 AI 操作：${fallbackPrompt}`,
        );

        await agent.aiAct(fallbackPrompt);

        console.log('✓ 備用 AI 操作完成');
      }

      // ======================================================
      // H. 確認輸入框已取得焦點
      // ======================================================

      console.log('');
      console.log('[2] 輸入詢價案號');

      /**
       * 如果前面的 AI Locate 成功：
       *
       *     click
       *       ↓
       *     input
       *
       * 此時直接輸入即可。
       *
       * 如果 fallback aiAct 已經輸入完成，
       * 這裡不能再次輸入。
       *
       * 因此只有 Locate 成功時才由 Playwright 填值。
       */
      if (locateResult) {
        await page.keyboard.type(QUOTATION_NO);

        console.log(
          `✓ 已輸入詢價案號：${QUOTATION_NO}`,
        );
      } else {
        console.log(
          '✓ 備用 AI 已負責輸入詢價案號',
        );
      }

      // ======================================================
      // I. Tab → Enter
      // ======================================================

      console.log('');
      console.log('[3] Tab → Enter 觸發查詢');

      /**
       * 使用者指定的操作流程：
       *
       *   INPUT
       *      │
       *      │ Tab
       *      ▼
       *   查詢按鈕
       *      │
       *      │ Enter
       *      ▼
       *   執行查詢
       *
       * 不直接 AI 點擊按鈕。
       */
      await page.keyboard.press('Tab');

      console.log('✓ Tab');

      await page.keyboard.press('Enter');

      console.log('✓ Enter');

      // ======================================================
      // J. 等待查詢結果
      // ======================================================

      console.log('');
      console.log('[4] 等待查詢結果載入...');

      /**
       * 使用者指定固定等待 4 秒。
       */
      await page.waitForTimeout(4000);

      console.log('✓ 已等待 4 秒');

      // ======================================================
      // K. AI Query 結構化資料
      // ======================================================

      console.log('');
      console.log('[5] 使用 Midscene aiQuery 擷取結果');

      /**
       * 使用泛型直接要求 Midscene 回傳：
       *
       * Array<ProcurementResult>
       *
       * 讓 TypeScript 同時知道資料結構。
       */
      const queryPrompt = `
提取查詢結果表格中的所有案件列表。

包含以下欄位：

- 詢價案號
- 採購名稱
- 申購公司/事業部
- 交貨地
- 數量和單位
- 截標時間
- 狀態

請嚴格依照以下資料結構輸出：

Array<{
  詢價案號: string,
  採購名稱: string,
  申購公司: string,
  交貨地: string,
  數量和單位: string,
  截標日期: string,
  狀態: string
}>

如果查詢結果沒有任何資料，請回傳空陣列 []。

不要加入 Markdown。
不要加入說明文字。
只回傳符合上述結構的 Array。
      `.trim();

      const result =
        await agent.aiQuery<ProcurementResult[]>(
          queryPrompt,
        );

      // ======================================================
      // L. 結構化輸出
      // ======================================================

      console.log('');
      console.log('========================================');
      console.log('查詢結果');
      console.log('========================================');

      /**
       * 需求：
       *
       * 如果：
       *   result 是 Array
       *
       * 使用：
       *   console.table()
       *
       * 否則：
       *   console.log()
       */
      if (Array.isArray(result)) {
        if (result.length === 0) {
          console.log('查詢結果：空陣列 []');
          console.log('沒有找到符合條件的案件。');
        } else {
          console.table(result);
        }
      } else {
        console.log(
          'AI 回傳結果不是陣列，原始結果如下：',
        );

        console.log(result);
      }

      // ======================================================
      // M. 基本測試驗證
      // ======================================================

      /**
       * 這裡只驗證：
       *
       *   aiQuery 回傳值是否為 Array
       *
       * 不要求 length > 0，
       * 因為「查無資料」本身是合法業務結果。
       */
      expect(
        Array.isArray(result),
        'aiQuery 應該回傳 Array',
      ).toBe(true);

      console.log('');
      console.log('========================================');
      console.log('測試完成');
      console.log('========================================');
    } finally {
      // ------------------------------------------------------
      // N. 清理 Midscene Agent
      // ------------------------------------------------------

      /**
       * Midscene Agent 使用完畢後釋放資源。
       */
      await agent.destroy();
    }
  });
});