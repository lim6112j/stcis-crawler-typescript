import { Page } from 'puppeteer'
import puppeteer from 'puppeteer'
const TIMEOUT = 15000
export default async function(page: Page, searchStr: string, dongName: string) {
  await page.goto('http://stcis.go.kr')
  await page.waitForSelector('body > header > div.header_inner > div.gnb > ul > li:nth-child(1) > a', { timeout: TIMEOUT })
  await page.focus('body > header > div.header_inner > div.gnb > ul > li:nth-child(1) > a')
  // main 페이지에서 메뉴 hover 시 서브메뉴 펼처짐(일반버스 도시철도 이용 O/D)
  await page.waitForSelector('#submenu1 > ul > li:nth-child(4) > ul > li:nth-child(1) > a', { timeout: TIMEOUT })
  await page.$eval('#submenu1 > ul > li:nth-child(4) > ul > li:nth-child(1) > a', elem => elem.click())
  // 시군구 - 선택 - 검색어 입력
  // 출발지 - 전체 선택
  const startInputBox = await page.waitForSelector('#rdStgptSelN', { timeout: TIMEOUT })
  startInputBox?.click()
  await page.waitForTimeout(1000)
  // 도착지 선택
  const endInputBox = await page.waitForSelector('#rdAlocSelY', { timeout: TIMEOUT })
  endInputBox?.click()
  // 검색어 입력
  await page.waitForSelector('#searchODEndSpaceNm', { timeout: TIMEOUT })
  await page.focus('#searchODEndSpaceNm')
  console.log("searching ... ", searchStr)
  await page.keyboard.type(searchStr, { delay: 300 })

  // 검색
  await page.waitForTimeout(1000)
  const search_btn2 = await page.waitForSelector('#space7 > li.box_flex > button', { timeout: TIMEOUT }) // 검색 클릭
  await search_btn2?.click()
  console.log("start location searching button clicked...")
  // 검색 결과 input check
  await page.waitForTimeout(1000)
  const destinationInputCheck = await page.waitForSelector('#divODEnd > ol > li', { timeout: TIMEOUT })
  await destinationInputCheck?.click()

  // 결과 검색
  await page.waitForTimeout(1000)
  const result_btn2 = await page.waitForSelector('#btnSearch > button', { timeout: TIMEOUT }) // 검색 클릭
  await result_btn2?.click()
  // download
  await page.waitForTimeout(1000)
  const domBtn2 = await page.waitForSelector('#rgrstyReportResult > h2 > p > span:nth-child(1)', { timeout: TIMEOUT })
  await domBtn2?.click()
  // back to selection page
  const backBtn2 = await page.waitForSelector('#tab1 > div.pivotResult > div.but_area_back > button', { timeout: TIMEOUT })
  await backBtn2?.click()
  await page.waitForTimeout(5000)
  // await page.screenshot({ path: "./stcis.png", fullPage: true })
  console.log("browser closing ...")
}
