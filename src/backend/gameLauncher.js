var propertiesReader = require('properties-reader');
var spawn = require('child_process').spawn;

var confFile = "/etc/productConf/cg.conf";
if (__dirname.includes("dev"))
    confFile = "/home/afercin/dev/CrossGameRPI/crossGameServer" + confFile;

const properties = propertiesReader(confFile);
const emulatorsPath = properties.get("PATH.emulators");

var emulatorName = null;
var preferredExtension = null;
var args = null;
var emulatorProcess = null;

function getEmulatorInfo(emulator) {
    emulatorName = properties.get(`${emulator}.emulatorName`);
    preferredExtension = properties.get(`${emulator}.preferredExtension`);
    args = properties.get(`${emulator}.args`);
}

module.exports.launchGame = ((game) => {
    console.log(`Launch game ${game.name} with emulator ${game.emulator}`);
    getEmulatorInfo(game.emulator.toUpperCase());
    if (emulatorName != null) {

        if (preferredExtension == null)
            isoFile = game.isos[0];
        else
            isoFile = game.isos.find((e) => e.includes(preferredExtension));

        args = args == null ? "" : args;

        emulatorProcess = spawn(`"${emulatorsPath}/${game.emulator}/${emulatorName}"`, [`${args} "${isoFile}"`]);
    }
});

module.exports.closeEmulator = () => {
    if (emulatorProcess != null)
        emulatorProcess.kill("SIGINT");
}