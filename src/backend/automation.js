var {incurring} = require("./process/Kenjo");
var {reportIncurring} = require("./process/Kenjo");


const automation = (async () =>{
    console.info("**** BEGIN PROCESS ****");
    //await incurring();  
    await reportIncurring();
})

module.exports.automation = automation;