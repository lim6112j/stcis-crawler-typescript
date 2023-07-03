import puppeteer from 'puppeteer'
const TIMEOUT = 15000
export default async function getDong(searchStr: string) {

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
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
  await page.waitForSelector('#divRdoODAear > li.searchODAreaGubun.active')

  const dongList = await page.evaluate(() => Array.from(document.querySelectorAll('#searchStgptZoneEmd option')).map((element: any) => element.innerText))
  // test code

  await page.waitForSelector('#searchODStartSpaceNm', { timeout: TIMEOUT })
  await page.focus('#searchODStartSpaceNm')
  console.log("searching ... ", searchStr)
  // 출발지  input box click
  await page.waitForTimeout(100)
  await page.keyboard.type('남동', { delay: 300 })
  await page.click('#space6 > li.box_flex > button')

  // test code end
  await page.waitForTimeout(1000000)
  await browser.close()
  return dongList
}
