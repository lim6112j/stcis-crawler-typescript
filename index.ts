import puppeteer from 'puppeteer'
(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto('http://stcis.go.kr')
  await page.focus('body > header > div.header_inner > div.gnb > ul > li:nth-child(1) > a')
  await page.waitForSelector('#submenu1 > ul > li:nth-child(4) > ul > li:nth-child(1) > a')
  await page.$eval('#submenu1 > ul > li:nth-child(4) > ul > li:nth-child(1) > a', elem => elem.click())
  await page.waitForTimeout(1000)
  await page.focus('#searchODStartSpaceNm')
  const searchStr = '안산시'
  console.log("searching ... ", searchStr)
  await page.keyboard.type(searchStr)
  const search_btn = await page.waitForSelector('#space6 > li.box_flex > button') // 검색 클릭
  await search_btn?.click()
  console.log("start location searching button clicked...")
  // 출발지  input box click
  await page.evaluate(() => {
    const startInputBox = document.querySelectorAll('#selODStartArea_1')[0] as HTMLInputElement
    startInputBox ? startInputBox.click() : console.log("구분이 잘못 지정된 지역명입니다")
  })

  // 도착지 전체선택
  await page.evaluate(() => {
    const EndInputBox = document.querySelectorAll('#rdAlocSelN')[0] as HTMLInputElement // 전체 선택
    EndInputBox ? EndInputBox.click() : console.log("구분이 잘못 지정된 지역명입니다")
  })

  // 결과 검색
  const result_btn = await page.waitForSelector('#btnSearch > button') // 검색 클릭
  await result_btn?.click()
  await page.waitForSelector('#tab1 > div.pivotResult > div.but_area_back > button')
  await page.waitForSelector('#rgrstyReportResult > table')


  // screenshot
  await page.waitForTimeout(1000)
  await page.screenshot({ path: "./stcis.png", fullPage: true })
  console.log("browser closing ...")
  await browser.close()
}
)()
