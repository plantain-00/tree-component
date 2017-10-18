import * as puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulate({ viewport: { width: 1440, height: 900 }, userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36" });

    for (const type of ["vue", "react", "angular"]) {
        await page.goto(`http://localhost:8000/demo/${type}`);
        await page.screenshot({ path: `screenshots/${type}-initial.png`, fullPage: true });

        await page.click(".default .tree-ocl-1");
        await page.waitFor(500);
        await page.screenshot({ path: `screenshots/${type}-open.png`, fullPage: true });

        await page.click(".default .tree-ocl-0-1");
        await page.screenshot({ path: `screenshots/${type}-close.png`, fullPage: true });

        await page.click(".checkbox .tree-checkbox-0-1");
        await page.screenshot({ path: `screenshots/${type}-select.png`, fullPage: true });

        await page.click(".checkbox .tree-checkbox-0-0");
        await page.screenshot({ path: `screenshots/${type}-deselect.png`, fullPage: true });

        if (type !== "angular") {
            await page.click(".contextmenu .tree-anchor-0-0", { button: "right" });
            await page.waitFor(100);
            await page.screenshot({ path: `screenshots/${type}-contextmenu.png`, fullPage: true });
        }
    }

    browser.close();
})();
