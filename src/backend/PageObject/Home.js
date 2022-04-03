
const _css = {
    //div_profile : ".gb-profile-spot"
    div_profile : "orgos-avatar[class='gb-avatar ng-star-inserted']"
}

const _xpath = {
    div_registroHorarioSP: "//div[text()='Registro de horas']",
    div_registroHorarioEN: "//div[text()='Attendance']"
}

/* Method to access the profile and later the time record*/
module.exports.accessProfile = (async (page) => {
    let accessed = true;
    try{
        await page.once('load', () => console.log('----- Page home loaded! -----'))

        await page.waitForTimeout(3000)
        await page.waitForSelector(_css.div_profile)
        await page.click(_css.div_profile)
        await page.waitForTimeout(3000)

        // The language used to access the time record is checked
        await page.waitForXPath(_xpath.div_registroHorarioSP)
        var element = await page.$x(_xpath.div_registroHorarioSP)
        if(element.length == 0){
            await page.waitForXPath(_xpath.div_registroHorarioEN)
            element = await page.$x(_xpath.div_registroHorarioEN)
        }

        // Enter the time log
        await element[0].click()
        
    }catch(err){
        console.error("An unhandled error occurs while accessing the profile. More detail " + err)
        console.log(err)
        accessed = false
    }
    return accessed;
});