```powershell
PS C:\Users\daphne\Downloads\工作台\Midscene_demo> npm init playwright@latest
Need to install the following packages:
create-playwright@1.17.139
Ok to proceed? (y) y

> npx
> create-playwright

Getting started with writing end-to-end tests with Playwright:
Initializing project in '.'
√ Do you want to use TypeScript or JavaScript? · TypeScript
√ Where to put your end-to-end tests? · tests
√ Add a GitHub Actions workflow? (Y/n) · false
√ Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · true
Initializing NPM project (npm init -y)…
Wrote to C:\Users\daphne\Downloads\工作台\Midscene_demo\package.json:

{
  "name": "midscene_demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs"
}


Installing Playwright Test (npm install --save-dev @playwright/test)…

added 3 packages, and audited 4 packages in 35s

found 0 vulnerabilities
Installing Types (npm install --save-dev @types/node)…

added 2 packages, and audited 6 packages in 14s

found 0 vulnerabilities
Writing playwright.config.ts.
Writing tests\example.spec.ts.
Writing package.json.
Downloading browsers (npx playwright install)…
114.6 MiB [====================] 100% 0.0s Get-ChildItem "C:\Users\daphne\Downloads\工作台\Midscene_demo"
122 MiB [====================] 100% 0.0s
Firefox 155.0 (playwright firefox v1543) downloaded to C:\Users\daphne\AppData\Local\ms-playwright\firefox-1543
Downloading WebKit 26.6 (playwright webkit v2359) from https://cdn.playwright.dev/dbazure/download/playwright/builds/webkit/2359/webkit-win64.zip
59.8 MiB [====================] 100% 0.0s
WebKit 26.6 (playwright webkit v2359) downloaded to C:\Users\daphne\AppData\Local\ms-playwright\webkit-2359
✔ Success! Created a Playwright Test project at C:\Users\daphne\Downloads\工作台\Midscene_demo

Inside that directory, you can run several commands:

  npx playwright test
    Runs the end-to-end tests.

  npx playwright test --ui
    Starts the interactive UI mode.

  npx playwright test --project=chromium
    Runs the tests only on Desktop Chrome.

  npx playwright test example
    Runs the tests in a specific file.

  npx playwright test --debug
    Runs the tests in debug mode.

  npx playwright codegen
    Auto generate tests with Codegen.

We suggest that you begin by typing:

    npx playwright test

And check out the following files:
  - .\tests\example.spec.ts - Example end-to-end test
  - .\playwright.config.ts - Playwright Test configuration

Visit https://playwright.dev/docs/intro for more information. ✨

npm notice
npm notice New major version of npm available! 11.16.0 -> 12.1.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.1.0
npm notice To update run: npm install -g npm@12.1.0
npm notice
PS C:\Users\daphne\Downloads\工作台\Midscene_demo> npm i @midscene/web --save-dev
npm warn deprecated whatwg-encoding@2.0.0: Use @exodus/bytes instead for a more spec-conformant and faster implementation

added 270 packages, and audited 276 packages in 2m

72 packages are looking for funding
  run `npm fund` for details

10 vulnerabilities (3 moderate, 7 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
npm warn allow-scripts 1 package has install scripts not yet covered by allowScripts:
npm warn allow-scripts   sharp@0.34.5 (install: node install/check.js || npm run build)
npm warn allow-scripts
npm warn allow-scripts Run `npm approve-scripts --allow-scripts-pending` to review, or `npm approve-scripts <pkg>` to allow.
PS C:\Users\daphne\Downloads\工作台\Midscene_demo> 
```