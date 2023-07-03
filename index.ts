import puppeteer, { Page } from 'puppeteer'
import { Cluster } from 'puppeteer-cluster'
import mssd from './multiStartSingleDestination'
import ssmd from './singleStartMultiDestination'
import getDong from './searchDong'
async function download(page: Page, searchStr: string, dongName: string, type: number) {
  switch (type) {
    case 0:
      await ssmd(page, searchStr, dongName)
      break;

    default:
      await mssd(page, searchStr, dongName)
      break;
  }
}
(async () => {

  try {
    if (process.argv[2] === undefined) { throw new Error("argument needed") }
  } catch (e) {
    console.log('argument needed')
    process.exit(1)
  }
  const searchStr = process.argv[2]
  const dongs = await getDong(searchStr)
  const listOfSearch = dongs.splice(1)
  console.log(listOfSearch)
  // const cluster = await Cluster.launch({
  //   concurrency: Cluster.CONCURRENCY_BROWSER,
  //   maxConcurrency: 1,
  //   puppeteerOptions: {
  //     headless: false
  //   }
  // });
  // await cluster.task(async ({ page, data }) => {
  //   await download(page, data.searchStr, data.dongName, data.type)
  // })
  // listOfSearch.forEach(val => {
  //   cluster.queue({ searchStr, dongName: val, type: 0 })
  //   cluster.queue({ searchStr, dongName: val, type: 1 })
  // })
  // await cluster.idle()
  // await cluster.close()
}
)()
