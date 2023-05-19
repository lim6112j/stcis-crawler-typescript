import { Page } from 'puppeteer'
import { Cluster } from 'puppeteer-cluster'
import mssd from './multiStartSingleDestination'
import ssmd from './singleStartMultiDestination'
async function download(page: Page, searchStr: string, type: number) {
  switch (type) {
    case 0:
      await ssmd(page, searchStr)
      break;

    default:
      await mssd(page, searchStr)
      break;
  }
}
(async () => {

  // try {
  //   if (process.argv[2] === undefined) { throw new Error("argument needed") }
  // } catch (e) {
  //   console.log('argument needed')
  //   process.exit(1)
  // }
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_BROWSER,
    maxConcurrency: 1,
    puppeteerOptions: {
      headless: false
    }
  });
  await cluster.task(async ({ page, data }) => {
    await download(page, data.searchStr, data.type)
  })
  const listOfSearch = ['아산시', '경주시', '안산시']
  listOfSearch.forEach(val => {
    cluster.queue({ searchStr: val, type: 0 })
    cluster.queue({ searchStr: val, type: 1 })
  })
  await cluster.idle()
  await cluster.close()
}
)()
