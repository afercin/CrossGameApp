var {automation} = require("./automation");

(function(){
    console.log = console.error = console.info = function (message) {
        //document.getElementById("console").text += message + "\n\s"
    };
})();

(new Promise(async (resolve,reject) => {
    try{  
        resolve(automation());
    }catch(error){
        reject(error)
    }
}))
.then(()=>console.info("**** FINISH PROCESS ****"))
.catch((err)=>console.error("worng processing. Details: \r\n".concat(err)));
