const puppeteer = require('puppeteer');
const { login } = require('../PageObject/Login');
const { accessProfile } = require('../PageObject/Home');
const { reportIncurring } = require('../PageObject/Hours');
const { incurring } = require('../PageObject/Hours');
var propertiesReader = require('properties-reader');
var rootPath = require('electron-root-path').rootPath + (process.platform == "linux" ? "/auto-kenjo" : "");

//Function to get browser path
function getBrowserPath() {
    switch (process.platform) {
        case "win32":
            browser = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
            break;
        case "darwin":
            browser = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
            break;
        case "linux":
            browser = "/usr/bin/firefox"
            break;
        default:
            console.error(`${process.platform} is not a supported platform`)
    }
    return browser;
}

//Function to get browser type
function getProduct() {
    return process.platform == "linux" ? "firefox" : "chrome";
}

//Method to incur the current month only in days whithout assignee time
module.exports.incurring = (async (user = "", pass = "") => {
    //Get user credentials
    var properties = propertiesReader(`${rootPath}/kenjo.properties`);

    //Read user credentials
    if (user == "")
        user = properties.get("USERNAME");
    if (pass == "")
        pass = properties.get("PASSWORD");

    //Throw exception when user or pass is empty
    if (user == "") 
        throw new Error("User email is empty");
    if (pass == "") 
        throw new Error("User password is empty");

    //Config browser
    const browser = await puppeteer.launch({
        headless: properties.get("HEADLESS"),
        executablePath: getBrowserPath(),
        product: getProduct(),
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    await page.goto('https://app.kenjo.io/signin', { timeout: 60000 });


    if (!await login(page, user, pass))
        throw new Error("An error occurred while logging in")

    console.info("Correct access to Kenjo")

    if (!await accessProfile(page))
        console.error("Occurred when accessing the time log")

    console.info("Correct access to the time log")

    if (!await incurring(page))
        console.error("Occurred when recording hours")

    console.info("The incurred of the current month has been made")
    
    await browser.close();
});

/*Method that shows for each day the number of hours and generates an alert in cases where the hours are not the expected:
  Winter time: 16 of September until 14 de June
    Monday to Thursday --> 8,5 hours
    Friday --> 7,5 hours
  Summer time: 15 of June until 15 de September (both inclusive) 
    All days --> 7,5 hours
 */
module.exports.reportIncurring = (async (user = "", pass = "") => {
    //Get user credentials
    var properties = propertiesReader(`${rootPath}/kenjo.properties`);

    //Read user credentials
    if (user == "")
        user = properties.get("USERNAME");
    if (pass == "")
        pass = properties.get("PASSWORD");

    //Throw exception when user or pass is empty
    if (user == "") 
        throw new EmptyCredentialsException("User email is empty");
    if (pass == "") 
        throw new EmptyCredentialsException("User password is empty");

    const browser = await puppeteer.launch({
        headless: properties.get("HEADLESS"),
        executablePath: getBrowserPath(),
        product: getProduct(),
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    await page.goto('https://app.kenjo.io/signin', { timeout: 60000 });


    if (!await login(page, user, pass))
        throw new Error("An error occurred while logging in")
        
    console.info("Correct access to Kenjo")

    if (!await accessProfile(page))
        throw new Error("An error occurred when accessing the time log")

    console.info("Correct access to the time log")

    if (!await reportIncurring(page))
        throw new Error("An error occurred while generating the hour report")
    
    console.info("Hours report generated correctly")

    await browser.close();
});
