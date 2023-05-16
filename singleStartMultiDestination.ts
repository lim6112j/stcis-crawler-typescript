export default const ssmd = (page: any) => {

  await page.waitForSelector('#searchODStartSpaceNm', { timeout: 1000 })
  await page.focus('#searchODStartSpaceNm')
  const searchStr = process.argv[2]
  console.log("searching ... ", searchStr)
  await page.keyboard.type(searchStr, { delay: 100 })
  const search_btn = await page.waitForSelector('#space6 > li.box_flex > button', { timeout: 1000 }) // 검색 클릭
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
  const loadingDiv = await page.waitForSelector('#none', { timeout: 1000 })
  const domBtn = await page.waitForSelector('#rgrstyReportResult > h2 > p > span:nth-child(1)', { timeout: 1000 })
  await domBtn?.click()
  // screenshot
  const backBtn = await page.waitForSelector('#tab1 > div.pivotResult > div.but_area_back > button', { timeout: 10000 })
  await backBtn?.click()
} 
