const {
    abort,
    cliExecute,
    equip,
    equippedItem,
    getProperty,
    haveEffect,
    itemAmount,
    myMaxhp,
    myHp,
    outfit,
    print,
    restoreMp,
    toSlot,
    toInt,
    toItem,
    toEffect,
    toFamiliar,
    useFamiliar,
    useSkill,
    visitUrl,
} = require('kolmafia');

// ---------------------------------------------
// ---- PART ONE: BUFFING ----------------------
// ---------------------------------------------

// Buffs cast by the user; if you don't have one, comment it out I guess.
const CASTBUFFS = [
    toEffect('Elemental Saucesphere'),
    toEffect('Astral Shell'),
    toEffect("Singer's Faithful Ocelot"),
    toEffect("Empathy"),
    toEffect("Blood Bond"),
    toEffect("Leash of Linguini"),
    toEffect("Blood Bubble"),
    toEffect("Springy Fusilli"),
    toEffect("Scarysauce"),
    toEffect("Phat Leon's Phat Loot Lyric"),
    toEffect("Minor Invulnerability"),
];

/**
 * Function that checks if something is equipped and if so does 
 *   nothing. Else, it equips it.
 */
function checkThenEquip(slot,item) {
    if (equippedItem(toSlot(slot)) === item) return;
    if (itemAmount(item) < 1) abort("You do not have a "+item.name+"... comment it out?");
    equip(toSlot(slot),item);
}

/**
 * Function used to ensure you are outfitted appropriately.
 */
function manageEquipment() {
    // Start with the base outfit you are using most of the day.
    checkThenEquip("hat",toItem("Crown of Thrones"));
    checkThenEquip("back",toItem("bat wings"));
    checkThenEquip("shirt",toItem("zero-trust tanktop"));
    checkThenEquip("weapon",toItem("June Cleaver"));
    checkThenEquip("off-hand",toItem("industrial fire extinguisher"));
    checkThenEquip("pants",toItem("pantsgiving"));
    checkThenEquip("acc1",toItem("mafia thumb ring"));
    checkThenEquip("acc2",toItem("Retrospecs"));
    checkThenEquip("acc3",toItem("Everfull Dart Holster"));

    // Equip your Peace Turkey, if it isn't equipped
    if (myFamiliar() != toFamiliar("Peace Turkey")) {
        useFamiliar(toFamiliar("Peace Turkey"));
    }

    // Equip your extinguisher if it still has fuel
    if (toInt(getProperty("_fireExtinguisherCharge")) == 0) {
        checkThenEquip("off-hand",toItem("visual packet sniffer"));
    }

    // Ensure darts are equipped for bullseyes if they're up.
    if (haveEffect(toEffect("Everything Looks Red")) < 1)
        checkThenEquip("acc3",toItem("Everfull Dart Holster"));

}

/**
 * Startup tasks when script begins. It's like breakfast! Except, for a script.
 */
function ahoyMaties() {
    // Use horsery for dark horse, because -com potions are gone and a marginal 
    //   accessory is +5 res vs -1 combat
    if (getProperty("horseryAvailable") === "true") {
        if (getProperty("_horsery") != "pale horse") cliExecute("horsery pale horse");
    }

    // Properly set up your retrocape.
    if (getProperty("retroCapeSuperhero") != "vampire" && getProperty("retroCapeWashingInstructions") != "hold") {
        cliExecute("retrocape vampire hold");
    }

    // For simplicity, just use one familiar
    useFamiliar(toFamiliar("Peace Turkey"));

    // Visit cyberrealm places
    visitUrl("place.php?whichplace=serverroom&action=serverroom_trash1");
    visitUrl("place.php?whichplace=serverroom&action=serverroom_chipdrawer");

    // Set default choice advs appropriately
    if (getProperty("choiceAdventure1545") != 1) cliExecute("set choiceAdventure1545 = 1");
    if (getProperty("choiceAdventure1546") != 1) cliExecute("set choiceAdventure1546 = 1");
    if (getProperty("choiceAdventure1547") != 1) cliExecute("set choiceAdventure1547 = 1");
    if (getProperty("choiceAdventure1548") != 1) cliExecute("set choiceAdventure1548 = 1");
    if (getProperty("choiceAdventure1549") != 1) cliExecute("set choiceAdventure1549 = 1");
    if (getProperty("choiceAdventure1550") != 1) cliExecute("set choiceAdventure1550 = 1");

    outfit("birthday suit");
}

/**
 * Executes restoration when necessary. Uses a 25% or 300 HP/MP threshold.
 */
function restoration() {
    var targetPercent = 0.90;
    var targetRaw = 300;
    
    // Sets your hpThreshold
    var hpThreshold = (myMaxhp()*targetPercent < targetRaw)
        ? targetRaw 
        : targetPercent*myMaxhp();

    // Just use cocoon. Don't want to use restoreHp in case I add cincho.
    while (myHp() < hpThreshold) {
        if (!haveSkill(toSkill("Cannelloni Cocoon"))) break;
        useSkill(toSkill("Cannelloni Cocoon"));
    }

    // Just use built in nonsense for MP restoration. Which may use rests. Alas.
    while (myMp() < targetRaw) restoreMp(500);

    return;

}

/**
 * Execute sources for buffs up to a given # of turns.
 * @param {number} turns        # of turns to buff to
 * @param {Effect[]} buffs      buffs to execute 
 */
function executeBuffs(turns, buffs) {
    // I wish this batch submitted
    buffs.forEach((buff) => {
        
        // Ensure the buff isn't some stupid empty element
        if (typeof buff.default === 'string') {

            // Iterate until you have the desired # of turns of the buff
            for (let i = 0; haveEffect(buff) < turns; i++ ) {
                // Variable for buff turns prior to executing the CLIEX.
                var buffTurns = haveEffect(buff);
                
                // Use the dumb cli execute strategy
                cliExecute("try; "+ buff.default);

                if (buffTurns === haveEffect(buff)) {
                    abort("Failed to buff up with "+buff+". Weird! Maybe comment it out or do it yourself?");
                }

                // If this gets stuck in a infinite loop, shut the thing off and alert user.
                if (i > 100000) {
                    abort("Attempts to gain "+buff+" failed. A lot!!! Comment it out and try again?");
                }
            }
        }
    });
}


function main(cmd) {

    var turnsToRun = 55;

    if (typeof cmd === 'undefined') {
        cmd="help";
    }

    if (cmd.includes("help")) {
        print("---------------------------------------------");
        print("====== > CYBERREALM TURN BURN SCRIPT !!!!");
        print("---------------------------------------------");
        print("");
        print("This is an extremely simplistic CyberRealm script. Here are currently supported commands:");
        print("");
        print(" - help ... this output");
        print(" - turns=10 ... runs 10 turns. change 10 to any int");
        print("");
        print("Please contribute to this script on GitHub if you want it to have more features. It sucks right now!");

    } else {
        
        if (cmd.includes("turns")) {
            cmd.split(" ").forEach((cmdlet) => {
                if (cmdlet.includes("=")) {
                    if (cmdlet.split("=")[0] === "turns") {
                        turnsToRun = toInt(cmdlet.split("=")[1]);
                    }
                }   
            });
        }

        ahoyMaties();
        manageEquipment();

        var buffsToSnag = CASTBUFFS;
    
        executeBuffs(turnsToRun, buffsToSnag);

    }

}

module.exports.main = main;