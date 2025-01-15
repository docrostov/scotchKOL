const {
    abort,
    adv1,
    cliExecute,
    equip,
    equippedItem,
    enthroneFamiliar,
    getProperty,
    haveEffect,
    haveSkill,
    itemAmount,
    myMaxhp,
    myHp,
    myMp,
    myFamiliar,
    myEnthronedFamiliar,
    myAdventures,
    myTurncount,
    outfit,
    print,
    printHtml,
    restoreMp,
    toSlot,
    toInt,
    toItem,
    toEffect,
    toSkill,
    toFamiliar,
    toLocation,
    useFamiliar,
    useSkill,
    urlEncode,
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
    toEffect("Curiosity of Br'er Tarrypin"),
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
    "if hasskill 7387",             // polar vortex
    "skill 7387",
    "endif",
    "if hasskill 226",              // perpetrate mild evil
    "skill 226",
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
    checkThenEquip("acc3",toItem("retro floppy disk"));

    // Equip your Peace Turkey or Grey Goose, if it isn't equipped. Because mafia 
    //   cannot detect items attached to terrarium familiars, I'm equipping 
    //   leashes when swapping them into the terrarium.
    if (toInt(getProperty("gooseDronesRemaining")) == 0) {
        if (myFamiliar() == toFamiliar ("Grey Goose")) print("goooooooose");
        else {
            checkThenEquip("familiar",toItem("filthy child leash"));
            useFamiliar(toFamiliar("Grey Goose"));
        }
    } 
    else {
        if (myFamiliar() == toFamiliar ("Peace Turkey")) print ("turkeyyyyyyyy");
        else {
            checkThenEquip("familiar",toItem("filthy child leash"));
            useFamiliar(toFamiliar("Peace Turkey"));
        }
    }

    // Equip your extinguisher if it still has fuel
    if (toInt(getProperty("_fireExtinguisherCharge")) == 0) {
        checkThenEquip("off-hand",toItem("visual packet sniffer"));
    }

    // Ensure darts are equipped for bullseyes if they're up.
    if (haveEffect(toEffect("Everything Looks Red")) < 1)
        checkThenEquip("acc3",toItem("Everfull Dart Holster"));

    // Adds an extra 1 each fight, worth 60/day, what the shit that's good lol
    checkThenEquip("familiar",toItem("familiar-in-the-middle wrapper"));

    // 
    if (myEnthronedFamiliar() != toFamiliar("Warbear Drone")) enthroneFamiliar(toFamiliar("Warbear Drone"));
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

    while (haveEffect(toEffect("Blue Swayed")) < 50 ) cliExecute("try; "+toEffect("Blue Swayed").default);

    if (turns > myAdventures()) turnsToPlay = myAdventures();
    
    const targetTurns = myTurncount() + turnsToPlay;

    for (let i=1; i < turnsToPlay + 1; i++) {
        // Break out if you've used the turns 
        if (myTurncount() >= targetTurns) break;

        var preAdvTurns = myTurncount();
        
        manageEquipment();
        restoration();

        if (toInt(getProperty("_cyberZone1Turns"))==20) currSnarf=586;
        if (toInt(getProperty("_cyberZone2Turns"))==20) currSnarf=587;
        if (toInt(getProperty("_cyberZone3Turns"))==20) break;

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

        // printHtml("<b><p style=\"font-family:'Courier'\">=======================================</p></b><br>");
        // printHtml("<b><p style=\"font-family:'Courier'\">= ----------------------  _+^^*+_     =</p></b><br>"); 
        // printHtml("<b><p style=\"font-family:'Courier'\">= - S I C K------------  {       )  ( =</p></b><br>"); 
        // printHtml("<b><p style=\"font-family:'Courier'\">= ---- H A C K -------  { (@)    } f  =</p></b><br>"); 
        // printHtml("<b><p style=\"font-family:'Courier'\">= ------- B R O ------ {:;-/    (_+*- =</p></b><br>"); 
        // printHtml("<b><p style=\"font-family:'Courier'\">= ------------------- ( /  (    (     =</p></b><br>"); 
        // printHtml("<b><p style=\"font-family:'Courier'\">= -------------------  U _/     )     =</p></b><br>");  
        // printHtml("<b><p style=\"font-family:'Courier'\">= --------------------  (      )  _(^ =</p></b><br>");      
        // printHtml("<b><p style=\"font-family:'Courier'\">= ------------------- (      /  (_))_ =</p></b><br>");  
        // printHtml("<b><p style=\"font-family:'Courier'\">= -------------------(     ,/    (^)) =</p></b><br>");  
        // printHtml("<b><p style=\"font-family:'Courier'\">= ------------------- *+__+*       (_ =</p></b><br>");
        // printHtml("<b><p style=\"font-family:'Courier'\">=======================================</p></b><br>");

        printHtml("<b><p style=\"font-family:'Courier new'\"><br>=======================================<br>=&nbsp;----------------------&nbsp;&nbsp;_+^^*+_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=<br>=&nbsp;-&nbsp;S&nbsp;I&nbsp;C&nbsp;K------------&nbsp;&nbsp;{&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;&nbsp;(&nbsp;=<br>=&nbsp;----&nbsp;H&nbsp;A&nbsp;C&nbsp;K&nbsp;-------&nbsp;&nbsp;{&nbsp;(@)&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;f&nbsp;&nbsp;=<br>=&nbsp;-------&nbsp;B&nbsp;R&nbsp;O&nbsp;------&nbsp;{:;-/&nbsp;&nbsp;&nbsp;&nbsp;(_+*-&nbsp;=<br>=&nbsp;-------------------&nbsp;(&nbsp;/&nbsp;&nbsp;(&nbsp;&nbsp;&nbsp;&nbsp;(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=<br>=&nbsp;-------------------&nbsp;&nbsp;U&nbsp;_/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=<br>=&nbsp;--------------------&nbsp;&nbsp;(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;&nbsp;_(^&nbsp;=<br>=&nbsp;-------------------&nbsp;(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;(_))_&nbsp;=<br>=&nbsp;-------------------(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,/&nbsp;&nbsp;&nbsp;&nbsp;(^))&nbsp;=<br>=&nbsp;-------------------&nbsp;*+__+*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(_&nbsp;=<br>=======================================<br></p></b>");
    }

}

module.exports.main = main;