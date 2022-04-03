var propertiesReader = require('properties-reader');
var rootPath = require('electron-root-path').rootPath + (process.platform == "linux" ? "/auto-kenjo" : "");

const _css = {
    div_containerDays: "[class='pdap-days-container logged-user'] > div",
    div_hour: "input[formcontrolname='hour']",
    div_minute: "input[formcontrolname='minute']",
    button_dave: ".pdap-save-button",
    orgos_comment: "orgos-input-simple-text",

    kenjo_month: "kenjo-input-month-picker",
    span_days: ".kenjo-no-user-select",
    div_spinner: "orgos-loading-spinner",
    div_holiday: ".pdap-bank-holiday",
    orgos_hours: "[class=kenjo-mr-10px][size='0']"
}

const _xpath = {
    div_xpath_containerDays: "//*[@class='pdap-days-container logged-user']/div",
}

// Method that generates a report with the hours incurred in the current month
module.exports.reportIncurring = (async (page) => {
    let reported = true;
    try {
        // Wait for the page to load
        await page.once('load', () => console.log('----- Page Register Hours loaded! -----'))
        await page.waitForSelector(_css.div_spinner, { hidden: true })
        //await page.waitForSelector(_css.div_containerDays)
        await page.waitForXPath(_xpath.div_xpath_containerDays)

        // Get month name
        const elMonth = await page.$(_css.kenjo_month)
        const nameMonth = await (await elMonth.getProperty('textContent')).jsonValue()


        // Get day list
        //const days = await page.$$(_css.div_containerDays)
        const days = await page.$x(_xpath.div_xpath_containerDays)

        //const test = await (await days[0].getProperty('innerHTML')).jsonValue()


        console.log(`--------- ${nameMonth} ---------`)

        // Loop for every day bin

        for (var i = 0; i < days.length; i++) {
            //for await ( day of days){

            // The class is recovered to find out if it is a normal day or a weekend
            //const className = await (await day.getProperty('className')).jsonValue()
            const className = await (await days[i].getProperty('className')).jsonValue()

            // Get the day
            //await day.waitForSelector(_css.span_days)
            await days[i].waitForSelector(_css.span_days)
            //const elDay = await day.$(_css.span_days)
            const elDay = await days[i].$(_css.span_days)
            const numDay = await (await elDay.getProperty('textContent')).jsonValue()

            // The hours incurred are obtained, if the element is not found it is assumed that it has not been incurred
            //const elHours = await day.$(_css.orgos_hours)
            const elHours = await days[i].$(_css.orgos_hours)
            var hours
            if (elHours == null) {
                hours = " 0h 0min "
            } else {
                hours = await (await elHours.getProperty('textContent')).jsonValue()
            }

            // It checks if the day is marked as a holiday
            //const holiday = await day.$eval(".pdap-bank-holiday", el => true).catch((e) => false);
            const holiday = await days[i].$eval(".pdap-bank-holiday", el => true).catch((e) => false);

            // If it is not a working day, it is identified between weekend and holidays
            if (className.includes('non-working-day')) {
                if (holiday) {
                    console.warn(`The day ${numDay} is holiday`)
                } else {
                    console.warn(`The day ${numDay} is weekend`)
                }

            } else {
                if (hours == " 0h 0min ") {
                    console.warn(`The day ${numDay} have ${hours} incurring`)
                } else {
                    const shedule = await verifySchedule(numDay)
                    //* TO DO - Según sí es verano o invierno, debe verificar el número de horas para pintarlo como warning o a nivel de info
                    console.log(`The day ${numDay} have ${hours} incurring`)
                }
            }
        }
        console.log(`--------- ${nameMonth} ---------`)
    } catch (err) {
        console.error("Se produce un error no controlado en el reporte de horas. Más detalle " + err.stack)
        console.log(err)
        reported = false
    }
    return reported;
});


module.exports.incurring = (async (page) => {
    let incurred = true;
    try {
        // Wait for the page to load
        await page.once('load', () => console.log('----- Page Register Hours loaded! -----'))
        await page.waitForSelector(_css.div_spinner, { hidden: true })
        //await page.waitForSelector(_css.div_containerDays)
        await page.waitForXPath(_xpath.div_xpath_containerDays)

        // Recuperar el mes
        const elMonth = await page.$(_css.kenjo_month)
        const nameMonth = await (await elMonth.getProperty('textContent')).jsonValue()


        // Get month name
        const days = await page.$$(_css.div_containerDays)
        const dateActually = new Date()

        console.log(`--------- ${nameMonth} ---------`)

        // Loop for every day bin
        for (var i = 0; i < days.length; i++) {
            //for await ( day of days){


            // The class is recovered to find out if it is a normal day or a weekend
            //const className = await (await day.getProperty('className')).jsonValue()
            const className = await (await days[i].getProperty('className')).jsonValue()

            // Get the day
            //await day.waitForSelector(_css.span_days)
            await days[i].waitForSelector(_css.span_days)
            //const elDay = await day.$(_css.span_days)
            const elDay = await days[i].$(_css.span_days)
            const numDay = await (await elDay.getProperty('textContent')).jsonValue()

            if (Number(numDay) <= dateActually.getDate()) {

                // The hours incurred are obtained, if the element is not found it is assumed that it has not been incurred
                //const elHours = await day.$(_css.orgos_hours)
                const elHours = await days[i].$(_css.orgos_hours)
                var hours
                if (elHours == null) {
                    hours = " 0h 0min "
                } else {
                    hours = await (await elHours.getProperty('textContent')).jsonValue()
                }

                // It checks if the day is marked as a holiday
                //const holiday = await day.$eval(".pdap-bank-holiday", el => true).catch((e) => false);
                const holiday = await days[i].$eval(".pdap-bank-holiday", el => true).catch((e) => false);

                // If it is not a working day, it is identified between weekend and holidays
                if (className.includes('non-working-day')) {
                    if (holiday) {
                        console.warn(`The day ${numDay} is holiday`)
                    } else {
                        console.warn(`The day ${numDay} is weekend`)
                    }

                } else {
                    // Get shedule, winter or summer
                    const shedule = await verifySchedule(numDay)

                    //Only incurring in days with 0 hours 0 minutes
                    if (hours == " 0h 0min ") {

                        //if(await incurringDay(day,shedule)){
                        const ref = i + 1
                        await page.waitForXPath(`//*[@class="pdap-days-container logged-user"]/div[${ref}]`)
                        const testDay = await page.$x(`//*[@class="pdap-days-container logged-user"]/div[${ref}]`)
                        //if(await incurringDay(days[i],shedule)){
                        if (await incurringDay(page, ref, shedule)) {
                            console.error(`When incurring the day ${numDay}`)
                        } else {
                            console.log(`The day ${numDay} has been incurred`)
                        }
                    } else {
                        console.log(`The day ${numDay} have ${hours} incurring`)
                    }
                }
            } else {
                console.log(`The day ${numDay} still cannot be incurred`)
            }
            page.waitForTimeout(1000)
        }
        console.log(`--------- ${nameMonth} ---------`)
    } catch (err) {
        console.error("Se produce un error no controlado en el reporte de horas. Más detalle " + err.stack)
        console.log(err)
        incurred = false
    }
    return incurred;
});

// Method to get the schedule
async function verifySchedule(numDay) {

    var shedule = ""
    // Get actually date for to use the year and the month   
    const dateActually = new Date();

    const sheduleSummerIni = new Date(dateActually.getFullYear(), 5, 15)
    const sheduleSummerFin = new Date(dateActually.getFullYear(), 8, 15)

    // Create date based on the day obtained
    const day = Number(numDay)
    const dateShedule = new Date(dateActually.getFullYear(), dateActually.getMonth(), day)

    // For friday the shedule is summer (7h 30m)
    if (dateShedule.getDay() == 5) {
        shedule = "summer"
        //console.log(`Date is ${stringShedule} . The day of week is Friday`)
    } else {
        // Shedule summer
        if (dateShedule >= sheduleSummerIni && dateShedule <= sheduleSummerFin) {
            shedule = "summer"
        }
        // Shedule winter
        else {
            shedule = "winter"
        }
    }
    return shedule
}

/* Method to incur according to the schedule.
    Winter time: 16 of September until 14 de June
        Monday to Thursday --> 8,5 hours
        Friday --> 7,5 hours
    Summer time: 15 of June until 15 de September (both inclusive) 
        All days --> 7,5 hours
*/
async function incurringDay(page, day, shedule) {
    let error = false;
    try {

        //await day.waitForSelector(_css.div_hour)
        //await day.waitForSelector(_css.div_minute)

        await page.waitForXPath(`//*[@class='pdap-days-container logged-user']/div[${day}]//input[@formcontrolname='hour']`)
        await page.waitForXPath(`//*[@class='pdap-days-container logged-user']/div[${day}]//input[@formcontrolname='minute']`)

        const arrayHours = await page.$x(`//*[@class='pdap-days-container logged-user']/div[${day}]//input[@formcontrolname='hour']`)
        const arrayMinutes = await page.$x(`//*[@class='pdap-days-container logged-user']/div[${day}]//input[@formcontrolname='minute']`)



        //const arrayHours = await day.$$(_css.div_hour)
        //const arrayMinutes = await day.$$(_css.div_minute)
        //const elementComment = await day.$(_css.orgos_comment)

        // The time is reported based on the configured schedule
        var hourMinute
        var expresion = /(\d*):(\d*)/

        var properties = propertiesReader(`${rootPath}/kenjo.properties`);
        if (shedule == "winter") {

            // Hour init
            hourMinute = properties.get("WINTERHOURINI").match(expresion)
            await arrayHours[0].type(hourMinute[1], { dealy: 500 })
            await arrayMinutes[0].type(hourMinute[2], { dealy: 500 })


            // Hour end
            hourMinute = properties.get("WINTERHOURFIN").match(expresion)
            await arrayHours[1].type(hourMinute[1], { dealy: 500 })
            await arrayMinutes[1].type(hourMinute[2], { dealy: 500 })


            // Hour paused
            hourMinute = properties.get("WINTERPAUSE").match(expresion)
            await arrayHours[2].type(hourMinute[1], { dealy: 500 })
            await arrayMinutes[2].type(hourMinute[2], { dealy: 500 })


        } else {
            // Hour init
            hourMinute = properties.get("SUMMERHOURINI").match(expresion)

            await arrayHours[0].type(hourMinute[1])
            await arrayMinutes[0].type(hourMinute[2])

            // Hour end
            hourMinute = properties.get("SUMMERHOURFIN").match(expresion)
            await arrayMinutes[1].type(hourMinute[2])
            await arrayHours[1].type(hourMinute[1])

            // Hour paused
            hourMinute = properties.get("SUMMERPAUSE").match(expresion)
            await arrayMinutes[2].type(hourMinute[2])
            await arrayHours[2].type(hourMinute[1])
        }

        // Focus is put on the comments so that the "Save" button is displayed
        await page.waitForXPath(`//*[@class='pdap-days-container logged-user']/div[${day}]//orgos-button-raised`)
        const buttonSave = await page.$x(`//*[@class='pdap-days-container logged-user']/div[${day}]//orgos-button-raised`)
        await buttonSave[0].click()

        //await elementComment.type("")
        //await day.waitForSelector(_css.button_dave)
        //const buttonSave = await day.$(_css.button_dave)
        //await buttonSave.click()

    } catch (e) {
        error = true
        console.log("Unhandled error when incurring: " + e.stack)
    }
    return error;
}