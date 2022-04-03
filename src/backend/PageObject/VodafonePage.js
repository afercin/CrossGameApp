const fs = require('fs');

const _css = {
    div_cabecera : "ftol-cat-item div.cintillo.ng-star-inserted",
    img_name : "ftol-cat-item img",
    pago : "ftol-cat-item section",
    buttonCookies: "[title='Aceptar cookies']"
}

module.exports.Moviles = (async (page) => {
    let error = false;
    try{

        await page.waitForSelector(_css.buttonCookies)
        await page.click(_css.buttonCookies)

        await page.waitForSelector("ftol-catalogo ul > li")
        await page.waitFor(10000);
        const moviles = await page.$$("ftol-catalogo ul > li")
        //const moviles = await page.evaluate({return document.querySelectorAll("ftol-catalogo ul > li")});
        
        
        const bodyHandle = await page.$('#wrapperMain');
        const arrayMoviles = await page.evaluate(() => {
            let datomoviles = [];
            let moviles = document.querySelectorAll('ftol-catalogo ul > li');

            for( var i = 0; i < moviles.length; i++){
                let movil = moviles[i];
                datomoviles.push({
                    cabecera : (movil.querySelector('ftol-cat-item div.cintillo.ng-star-inserted'))?movil.querySelector('ftol-cat-item div.cintillo.ng-star-inserted').innerText:'',
                    imagen : (movil.querySelector("ftol-cat-item source:nth-child(1)"))?movil.querySelector("ftol-cat-item source:nth-child(1)").srcset:'',
                    nombre : (movil.querySelector("ftol-cat-item img"))?movil.querySelector("ftol-cat-item img").alt:'',
                    pagoPlazos : (movil.querySelector("ftol-cat-item section div[class*=pagoPlazos]"))?movil.querySelector("ftol-cat-item section div[class*=pagoPlazos]").textContent:'',
                    pagoContado : (movil.querySelector("ftol-cat-item section div[class=ng-star-inserted]"))?movil.querySelector("ftol-cat-item section div[class=ng-star-inserted]").textContent:''
                })
            }
            return datomoviles;
        });
        

        // let datosMoviles = []

        // for( var i = 0; i < moviles.length; i++){
        //     let movil = moviles[i];
        //     datosMoviles.push({
        //         cabecera : await movil.evaluate(node => {try{return node.querySelector("ftol-cat-item div.cintillo.ng-star-inserted").innerText}catch(error){ return ''}}),
        //         imagen : "https://www.vodafone.es".concat(await movil.evaluate(node => node.querySelector("ftol-cat-item source:nth-child(1)").srcset)),
        //         nombre : await movil.evaluate(node => node.querySelector("ftol-cat-item img").alt),
        //         pagoPlazos : await movil.evaluate(node => {try{return node.querySelector("ftol-cat-item section div[class*=pagoPlazos]").textContent}catch(error){ return ''}}),
        //         pagoContado : await movil.evaluate(node => {try{return node.querySelector("ftol-cat-item section div[class=ng-star-inserted]").textContent}catch(error){ return ''}})
        //     })
        // }

        const jsonContent = JSON.stringify(arrayMoviles);

        // var stream = fs.createWriteStream("./resources/output.json");
        //     stream.once('open', function(fd) {
        //     stream.write(jsonContent);
            
        //     stream.end();
        // });

        fs.writeFileSync("./resources/output.json", jsonContent,'utf-8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
         
            console.log("JSON file has been saved.");
        });

        return false;
    }catch(error){
        console.log("Se genera un error en el proceso scrapping de vodafone")
        console.log(error)
        return true;
    }
});

module.exports.Movilesv2 = (async (page) => {
    let error = false;
    try{

        await page.waitForSelector(_css.buttonCookies)
        await page.click(_css.buttonCookies)

        await page.waitForSelector("ftol-catalogo ul > li")
        await page.waitFor(10000);
        const moviles = await page.$$("ftol-catalogo ul > li")
        //const moviles = await page.evaluate({return document.querySelectorAll("ftol-catalogo ul > li")});
        const imagenes = await page.$$("ftol-catalogo ul > li ftol-cat-item source:nth-child(1)")
        
        let datosMoviles = []

        for( var i = 0; i < moviles.length; i++){
            let movil = moviles[i];
            let imagen = imagenes[i]
            let testOuterImagen = await imagen.evaluate(node => node.getAttribute('lazyload'))
            
            datosMoviles.push({
                cabecera : await movil.evaluate(node => {try{return node.querySelector("ftol-cat-item div.cintillo.ng-star-inserted").innerText}catch(error){ return ''}}),
                imagen : "https://www.vodafone.es".concat(await imagen.evaluate(node => node.getAttribute('lazyload'))),
                nombre : await movil.evaluate(node => node.querySelector("ftol-cat-item img").alt),
                pagoPlazos : await movil.evaluate(node => {try{return node.querySelector("ftol-cat-item section div[class*=pagoPlazos]").textContent}catch(error){ return ''}}),
                pagoContado : await movil.evaluate(node => {try{return node.querySelector("ftol-cat-item section div[class=ng-star-inserted]").textContent}catch(error){ return ''}})
            })
        }

        const jsonContent = JSON.stringify(datosMoviles);

        fs.writeFileSync("./resources/output.json", jsonContent,'utf-8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
         
            console.log("JSON file has been saved.");
        });

        return false;
    }catch(error){
        console.log("Se genera un error en el proceso scrapping de vodafone")
        console.log(error)
        return true;
    }
});