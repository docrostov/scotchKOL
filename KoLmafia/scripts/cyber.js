const {
    abort,
    adv1,
    cliExecute,
    equip,
    equippedItem,
    getProperty,
    haveEffect,
    itemAmount,
    myMaxhp,
    myHp,
    myFamiliar,
    myAdventures,
    myTurncount,
    outfit,
    print,
    restoreMp,
    toSlot,
    toInt,
    toItem,
    toEffect,
    toFamiliar,
    toLocation,
    useFamiliar,
    useSkill,
    visitUrl,
    xpath,
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
    toEffect("Skeletal Warrior"),
    toEffect("Skeletal Cleric"),
    toEffect("Skeletal Wizard"),
    toEffect("Skeletal Rogue"),
    toEffect("Skeletal Buddy"),
    toEffect("The Psalm of Pointiness"),
    toEffect("Scarysauce"),
    toEffect("Spiky Shell"),
];

// This is a simple CCS.
const RAWCOMBAT = [
    "if monstername hacker",
    "if hasskill 7530",             // swoop like a bat
    "skill 7530",
    "endif",
    "if hasskill 7410",             // emit drones
    "skill 7410",
    "endif",
    "if hasskill 7423",             // parka YR
    "skill 7423",    
    "endif",
    "if hasskill 7521",             // dart freekill
    "skill 7521",
    "endif",
    "if hasskill Bowl Straight Up", // item buff
    "skill Bowl Straight Up",      
    "endif",
    "if hascombatitem porquoise-handled sixgun",
    "use porquoise-handled sixgun",
    "endif",
    "attack",
    "repeat",
    "endif",
    "skill 7542",
    "repeat",
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
 * This function is basically taken from loathers/libram. Specifically,
 *   getMacroID and the setAutoattack functions. Thanks to Neil & Bean.
 */
function setupCombat() {
    // Set default macro information.
    var macroName = "cyberrealm";
    var builtCCS = RAWCOMBAT.join(";");

    // Use an xpath query to look at all macro names.
    const query = `//select[@name="macroid"]/option[text()="${macroName}"]/@value`;
    const macroWebpage = visitUrl("account_combatmacros.php");
    var macroMatches = xpath(macroWebpage, query);

    // Check if the new macro exists
    if (macroMatches.length === 0) {
        visitUrl("account_combatmacros.php?action=new");
        const newMacroText = visitUrl(`account_combatmacros.php?macroid=0&name=${macroName}&macrotext=abort&action=save`);
        macroMatches = xpath(newMacroText, query);
    }

    // The autoAttack ID is different from the macro ID; need to add 99 mil!
    var macroID = parseInt(macroMatches[0],10);
    var autoAttackID = 99000000 + macroID;

    visitUrl('account_combatmacros.php?action=new');
    visitUrl('account_combatmacros.php?macroid='+macroID+'&name='+macroName+'&macrotext='+urlEncode(builtCCS)+'&action=save',true, true,);
    visitUrl('account.php?am=1&action=autoattack&value='+autoAttackID+'&ajax=1');
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

function runTurns(turns) {
    var currSnarf = 585;
    setupCombat();
    var turnsToPlay = turns;
    var cyberBool = true;

    if (turns > myAdventures()) turnsToPlay = myAdventures();
    
    const targetTurns = myTurncount() + turnsToPlay;

    for (let i=1; i < turnsToPlay + 1; i++) {
        // Break out if you've used the turns 
        if (myTurncount() >= targetTurns) break;

        var preAdvTurns = myTurncount();
        
        manageEquipment(islandToRun);
        restoration();

        if (!cyberBool) currSnarf+=1;
        if (currSnarf > 587) abort("All done!")

        if (myAdventures() > 0) {
            cyberBool = adv1(toLocation(currSnarf),1);
        }

        if (myAdventures() > 0 && preAdvTurns === myTurncount()) i--; 
        
        if (itemAmount(toItem("autumn-aton")) > 0)  cliExecute("autumnaton send shadow rift");
    }
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

        runTurns(turnsToRun);

    }

}

module.exports.main = main;