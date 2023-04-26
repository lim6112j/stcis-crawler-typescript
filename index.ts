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
  await page.keyboard.type('아산시')
  const search_btn = await page.waitForSelector('#space6 > li.box_flex > button') // 검색 클릭
  await search_btn?.click()
  await page.waitForTimeout(1000)
  await page.evaluate(() => {
    (document.querySelectorAll('label[id^="label_"] > div')[0] as HTMLElement).click()
  })
  // console.log(label)
  // await page.click('#label_44200 > div')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: "./stcis.png", fullPage: true })
  await page.waitForTimeout(100000)
  await browser.close()
}
)()
