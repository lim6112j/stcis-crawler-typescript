import puppeteer from 'puppeteer'
(async () => {

  try {
    if (process.argv[2] === undefined) { throw new Error("argument needed") }
  } catch (e) {
    console.log('argument needed')
    process.exit(1)
  }
  async function move_page(idx: number) {
    // #rgrstyReportResult > div > ul > li:nth-child(2) > a
    const pagination = await page.waitForSelector(`#rgrstyReportResult > div > ul > li:nth-child(${idx}) > a`)
    await pagination?.click()
  }
  async function get_table_value() {
    const page_data = await page.evaluate(() => Array.from(
      document.querySelectorAll('#rgrstyReportResult > table > tbody > tr'),
      (row: any) => Array.from(row.querySelectorAll('th, td'), (cell: HTMLElement) => cell.innerText)
    ))
    return page_data
  }
  async function wait_for_pagination() {

    await page.waitForSelector('#tab1 > div.pivotResult > div.but_area_back > button')
    await page.waitForSelector('#rgrstyReportResult > table')
  }
  const browser = await puppeteer.launch({ headless: false, userDataDir: './data/' })
  const page = await browser.newPage()
  await page.goto('http://stcis.go.kr')
  await page.waitForSelector('body > header > div.header_inner > div.gnb > ul > li:nth-child(1) > a')
  await page.focus('body > header > div.header_inner > div.gnb > ul > li:nth-child(1) > a')
  await page.waitForSelector('#submenu1 > ul > li:nth-child(4) > ul > li:nth-child(1) > a')
  await page.$eval('#submenu1 > ul > li:nth-child(4) > ul > li:nth-child(1) > a', elem => elem.click())
  await page.waitForSelector('#searchODStartSpaceNm')
  await page.focus('#searchODStartSpaceNm')
  const searchStr = process.argv[2]
  console.log("searching ... ", searchStr)
  await page.keyboard.type(searchStr, { delay: 100 })
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
  await wait_for_pagination()
  // table paging
  //
  const pageNum = await page.evaluate(
    () => {
      return document.querySelectorAll('.tbl_paging > ul > li').length
    }
  )
  console.log("pagenation number = ", pageNum)
  // table to json
  // #rgrstyReportResult > div > ul > li:nth-child(2) > a
  let data: any = [];
  for (let index = 0; index < pageNum; index++) {
    if (index === 0) {
      const _data = await get_table_value()
      data = data.concat(_data)
    } else {
      await move_page(index + 1)
      await wait_for_pagination()
      const _data = await get_table_value()
      data = data.concat(_data)
    }
  }

  console.log(data)
  const domBtn = await page.waitForSelector('#rgrstyReportResult > h2 > p > span:nth-child(1)', { timeout: 1000 })
  await domBtn?.click()
  // screenshot
  await page.waitForTimeout(1000000)
  // await page.screenshot({ path: "./stcis.png", fullPage: true })
  console.log("browser closing ...")
  await browser.close()
}
)()
