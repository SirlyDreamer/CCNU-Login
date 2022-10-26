const puppeteer = require("puppeteer");

var account = {
    username: process.env.USERNAME,
    password: process.env.PASSWORD
}

async function main() {
    var timer = setTimeout(async function daemon() {
        const browser = await puppeteer.launch({
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process'
            ]
        });
        const page = await browser.newPage();
        let uri = "https://www.baidu.com";
        //document.querySelector("#su")
        try {
            await page.goto(uri, {waitUntil: "networkidle2"});
            await page.click('#su');
            console.log("[INFO] 网络连接正常");
            await page.close();
            await browser.close();
            timer = setTimeout(daemon, 600000);
            return;
        } catch (e) {
            console.log("[ERR] 网络连接断开，正在尝试登录");
            let uri = "https://portal.ccnu.edu.cn";
            try {
                await page.goto(uri, {waitUntil: "networkidle2"});
                await page.click('#login-account');
            } catch (e) {
                console.log("[ERR] 登录页面加载失败");
                await page.close();
                await browser.close();
                timer = setTimeout(daemon, 10000);
                return;
            }
            try {
                let ip = await page.$eval("#ipv4", ele => ele.innerHTML);
                console.log("[INFO] 您已经登陆过了，您的IPv4地址是:" + ip);
                await page.close();
                await browser.close();
                timer = setTimeout(daemon, 10000);
            } catch (e) {
                try {
                    await page.goto(uri, {waitUntil: "networkidle2"});
                    await page.type('#username', account.username);
                    await page.type('#password', account.password);
                    await page.click('#login-account');
                    await page.waitForNavigation({waitUntil: "networkidle2"});
                    let ip = await page.$eval("#ipv4", ele => ele.innerHTML);
                    console.log("[INFO] 登录成功，您的IPv4地址是:" + ip);
                    await page.close();
                    await browser.close();
                    setTimeout(daemon, 10000);
                } catch (e) {
                    console.log("[ERR] 登录失败");
                    await page.close();
                    await browser.close();
                    setTimeout(daemon, 10000);
                }
            }
        }
    }, 0);
}

main();