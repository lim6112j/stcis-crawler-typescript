import { Cluster } from 'puppeteer-cluster'
import ssmd from './singleStartMultiDestination'
import mssd from './multiStartSingleDestination'
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
  await cluster.task(async ({ page, data: searchStr }) => {
    await ssmd(page, searchStr)
  })
  cluster.queue('아산시')
  cluster.queue('경주시')
  cluster.queue('안산시')
  await cluster.idle()
  await cluster.close()
}
)()
