import puppeteer from 'puppeteer'

(async() => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.emulate({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' })

  const cases = [
    { type: 'vue', url: '/packages/vue/demo' },
    { type: 'react', url: '/packages/react/demo' },
    { type: 'angular', url: '/packages/angular/demo/jit' },
    { type: 'aot', url: '/packages/angular/demo/aot' }
  ]

  for (const { type, url } of cases) {
    await page.goto(`http://localhost:8000${url}`)
    await page.screenshot({ path: `screenshots/${type}-initial.png` })

    await page.click('.default .tree-ocl-1')
    await page.waitFor(500)
    await page.screenshot({ path: `screenshots/${type}-open.png` })

    await page.click('.default .tree-ocl-0-1')
    await page.screenshot({ path: `screenshots/${type}-close.png` })

    await page.click('.checkbox .tree-checkbox-0-1')
    await page.screenshot({ path: `screenshots/${type}-select.png` })

    await page.click('.checkbox .tree-checkbox-0-0')
    await page.screenshot({ path: `screenshots/${type}-deselect.png` })

    if (type !== 'angular' && type !== 'aot') {
      await page.click('.contextmenu .tree-anchor-0-0', { button: 'right' })
      await page.waitFor(100)
      await page.screenshot({ path: `screenshots/${type}-contextmenu.png` })
    }
  }

  await browser.close()
})()
