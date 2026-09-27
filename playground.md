```powershell
PS C:\Users\donny\Downloads\工作台\Midscene_demo> 
PS C:\Users\donny\Downloads\工作台\Midscene_demo> npx @midscene/web connect --url https://www.e-fpg.com.tw/j2pt/
Connected to: https://www.e-fpg.com.tw/j2pt/
Screenshot saved: C:\Users\donny\AppData\Local\Temp\screenshot-1790527022208.jpeg
PS C:\Users\donny\Downloads\工作台\Midscene_demo> npx @midscene/web tap --locate "會員申請動態查詢"
Invalid value for "--locate" in midscene-web tap: Expected object, received string
PS C:\Users\donny\Downloads\工作台\Midscene_demo> npx @midscene/web tap --locate '{\"prompt\":\"會員申請動態查詢\"}'
Midscene - report file updated: C:\Users\donny\Downloads\工作台\Midscene_demo\midscene_run\report\midscene-web-https___www.e-fpg.com.tw_j2pt_-2026-09-28_00-36-57-kksf1xaa.html
Action "Tap" completed.
Screenshot saved: C:\Users\donny\AppData\Local\Temp\screenshot-1790527280255.jpeg
PS C:\Users\donny\Downloads\工作台\Midscene_demo> 
```