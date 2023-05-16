
import puppeteer from 'puppeteer'
export default async function() {
  const browser = await puppeteer.launch({ headless: false, userDataDir: './data/' })
  const page = await browser.newPage()
  await page.goto('http://stcis.go.kr')
  await page.waitForSelector('body > header > div.header_inner > div.gnb > ul > li:nth-child(1) > a', { timeout: 1000 })
  await page.focus('body > header > div.header_inner > div.gnb > ul > li:nth-child(1) > a')
  // main 페이지에서 메뉴 hover 시 서브메뉴 펼처짐(일반버스 도시철도 이용 O/D)
  await page.waitForSelector('#submenu1 > ul > li:nth-child(4) > ul > li:nth-child(1) > a', { timeout: 1000 })
  await page.$eval('#submenu1 > ul > li:nth-child(4) > ul > li:nth-child(1) > a', elem => elem.click())
  // 시군구 - 선택 - 검색어 입력
  // 출발지 - 전체 선택
  const startInputBox = await page.waitForSelector('#rdStgptSelN', { timeout: 1000 })
  startInputBox?.click()
  await page.waitForTimeout(1000)
  // 도착지 선택
  const endInputBox = await page.waitForSelector('#rdAlocSelY', { timeout: 1000 })
  endInputBox?.click()
  // 검색어 입력
  await page.waitForSelector('#searchODEndSpaceNm', { timeout: 1000 })
  await page.focus('#searchODEndSpaceNm')
  const searchStr = process.argv[2]
  console.log("searching ... ", searchStr)
  await page.keyboard.type(searchStr, { delay: 200 })

  // 검색
  const search_btn = await page.waitForSelector('#space7 > li.box_flex > button', { timeout: 1000 }) // 검색 클릭
  search_btn?.click()
  console.log("start location searching button clicked...")
  // 검색 결과 input check
  const destinationInputCheck = await page.waitForSelector('#selODEndArea_1', { timeout: 1000 })
  destinationInputCheck?.click()

  // 결과 검색
  const result_btn = await page.waitForSelector('#btnSearch > button', { timeout: 1000 }) // 검색 클릭
  result_btn?.click()
  // download
  await page.waitForSelector('#none', { timeout: 1000 })
  const domBtn = await page.waitForSelector('#rgrstyReportResult > h2 > p > span:nth-child(1)', { timeout: 10000 })
  domBtn?.click()
  // back to selection page
  const backBtn = await page.waitForSelector('#tab1 > div.pivotResult > div.but_area_back > button', { timeout: 10000 })
  backBtn?.click()
  await page.waitForTimeout(100000)
  // await page.screenshot({ path: "./stcis.png", fullPage: true })
  console.log("browser closing ...")
  await browser.close()
}
