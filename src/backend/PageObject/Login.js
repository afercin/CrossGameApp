var {isElementVisible} = require("../utils/utils")

const _css = {
    input_email : "#sign-in-input-email",
    input_pass : "#sign-in-input-password",
    button_signin: ".sip-sign-in-button",
    span_message: "simple-snack-bar span"
}

module.exports.login = (async (page, user, pass) => {
    let logged = true;
    try{
        await page.once('load', () => console.log('----- Page Login loaded! -----'));

        await page.waitForSelector(_css.input_email)
        await page.type(_css.input_email, user)

        await page.waitForSelector(_css.input_pass)
        await page.type(_css.input_pass, pass)

        await page.waitForSelector(_css.button_signin)
        await page.click(_css.button_signin)

        if (await isElementVisible(page, _css.span_message)){
            const message = await page.$eval(_css.span_message, (el) => el.textContent);
            if (message == "Sign in failed. Invalid email or password."){
                console.error(message)
                logged = false
            }
        }
        
    }catch(err){
        console.error("Se produce un error no controlado en el login. Más detalle " + err)
        logged = false
    }
    return logged;
});

