import { Page } from 'puppeteer'
const TIMEOUT = 15000
export default async function(page: Page, searchStr: string, dongName: string) {
  await page.goto('http://stcis.go.kr')
  await page.waitForSelector('body > header > div.header_inner > div.gnb > ul > li:nth-child(1) > a', { timeout: TIMEOUT })
  await page.focus('body > header > div.header_inner > div.gnb > ul > li:nth-child(1) > a')
  // main 페이지에서 메뉴 hover 시 서브메뉴 펼처짐(일반버스 도시철도 이용 O/D)
  await page.waitForSelector('#submenu1 > ul > li:nth-child(4) > ul > li:nth-child(1) > a', { timeout: TIMEOUT })
  await page.$eval('#submenu1 > ul > li:nth-child(4) > ul > li:nth-child(1) > a', elem => elem.click())

  // 출발지 선택
  const startInputBox = await page.waitForSelector('#rdStgptSelY', { timeout: TIMEOUT })
  startInputBox?.click()

  await page.waitForTimeout(1000)
  await page.waitForSelector('#searchODStartSpaceNm', { timeout: TIMEOUT })
  await page.focus('#searchODStartSpaceNm')
  console.log("searching ... ", searchStr)
  // 출발지  input box click
  await page.waitForTimeout(100)
  await page.keyboard.type(searchStr, { delay: 300 })

  await page.waitForTimeout(1000)
  const search_btn = await page.waitForSelector('#space6 > li.box_flex > button', { timeout: TIMEOUT }) // 검색 클릭
  await search_btn?.click()
  console.log("start location searching button clicked...")
  // 출발지  input box click
  await page.waitForTimeout(1000)
  const startInputCheck = await page.waitForSelector('#divODStart > ol > li', { timeout: TIMEOUT })
  await startInputCheck?.click()
  await page.waitForTimeout(1000)
  // 도착지 전체선택
  const endInputBox = await page.waitForSelector('#rdAlocSelN', { timeout: TIMEOUT })
  endInputBox?.click()

  // 결과 검색
  const result_btn = await page.waitForSelector('#btnSearch > button', { timeout: TIMEOUT }) // 검색 클릭
  result_btn?.click()
  //download
  const hiddenlayer = await page.waitForSelector('#none', { timeout: TIMEOUT })
  const domBtn = await page.waitForSelector('#rgrstyReportResult > h2 > p > span:nth-child(1)', { timeout: TIMEOUT })
  domBtn?.click()
  // screenshot
  const backBtn = await page.waitForSelector('#tab1 > div.pivotResult > div.but_area_back > button', { timeout: TIMEOUT })
  backBtn?.click()
  hiddenlayer?.getProperty('style').then(val => console.log(val))
  await page.waitForTimeout(5000)
  // await page.screenshot({ path: "./stcis.png", fullPage: true })
} 
