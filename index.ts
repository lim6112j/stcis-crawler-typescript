import ssmd from './singleStartMultiDestination'
import mssd from './multiStartSingleDestination'
(async () => {

  try {
    if (process.argv[2] === undefined) { throw new Error("argument needed") }
  } catch (e) {
    console.log('argument needed')
    process.exit(1)
  }
  await ssmd()
  //await mssd()
  // 출발지 검색 창에 입력
}
)()
