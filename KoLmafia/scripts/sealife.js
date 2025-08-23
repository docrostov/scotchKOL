const {
    equippedItem,
    cliExecute,
    equip,
    itemAmount,
    myLevel,
    myMp,
    myPath,
    takeStorage,
    toEffect,
    toFamiliar,
    toItem,
    toSlot,
    useFamiliar,
    use,
    useSkill,
    visitUrl,
} = require('kolmafia');

// ============================================
// ------- HELPER FUNCTIONS -------------------
// ============================================

/**
 * Function that checks if something is equipped and if so does 
 *   nothing. Else, it equips it.
 */
function checkThenEquip(slot,item) {
    if (equippedItem(toSlot(slot)) === item) return;
    if (itemAmount(item) < 1) abort("You do not have a "+item.name+"... comment it out?");
    equip(toSlot(slot),item);
}

// ============================================
// ------- SEA PATH!!!!!!!! -------------------
// ============================================

var inSea = myPath().id == 55;

// Start with pulls
if (inSea) takeStorage(1, toItem("mer-kin scholar mask"));
if (inSea) takeStorage(1, toItem("mer-kin scholar tailpiece"));
if (inSea) takeStorage(1, toItem("mer-kin gladiator mask"));
if (inSea) takeStorage(1, toItem("mer-kin gladiator tailpiece"));
if (inSea) takeStorage(1, toItem("shark jumper"));
if (inSea) takeStorage(1, toItem("scale-mail underwear"));
if (inSea) takeStorage(1, toItem("sea cowboy hat"));
if (inSea) takeStorage(1, toItem("sea chaps"));
// if (inSea) takeStorage(1, toItem("sea cowbell"));
if (inSea) takeStorage(1, toItem("mer-kin wordquiz"));
if (inSea) takeStorage(1, toItem("mer-kin cheatsheet"));

// Use relevant stuff
if (inSea) useItem(toItem("mer-kin wordquiz"));
if (myLevel() > 19) useItem(toItem("wardrobe-o-matic"));
use(1,toItem("TakerSpace letter of Marque"));

// Things needed active for later stuff
useFamiliar(toFamiliar("Chest Mimic"));
checkThenEquip("hat",toItem("futuristic hat"));
checkThenEquip("back",toItem("bat wings"));
checkThenEquip("shirt",toItem("futuristic shirt"));
checkThenEquip("weapon",toItem("candy cane sword cane"));
checkThenEquip("off-hand",toItem("April Shower Thoughts shield"));
checkThenEquip("pants",toItem("tearaway pants"));
checkThenEquip("acc1",toItem("Everfull dart holster"));
checkThenEquip("acc2",toItem("Spring shoes"));

// A few specific visitUrls
visitUrl("campground.php?preaction=leaves");
visitUrl("inventory.php?action=skiduffel");
visitUrl("campground.php?action=workshed");
visitUrl("inv_use.php?which=3&whichitem=11257");
visitUrl("inventory.php?action=shower");

// Set the choice then use the goodies sack
cliExecute("set choiceAdventure1565=1");
visitUrl("council.php");
use(toItem("letter from King Ralph XI"));
use(toItem("pork elf goodies sack"));
cliExecute("sell * baconstone; sell * porquoise; sell * hamethyst;");

// Some CLIEXes
cliExecute("breakfast");
cliExecute("find Sheriff pistol");
cliExecute("find Sheriff badge");
cliExecute("find Sheriff moustache");
cliExecute("photobooth effect wild");
cliExecute("mayam resonance stinkbomb");
cliExecute("mayam rings fur meat yam clock");
cliExecute("leprecondo furnish padded,laptop,retro,workout");

// Create stuff
cliExecute("create 3 septapus charm");
cliExecute("create 1 Spooky VHS Tape");
cliExecute("create 1 Flash Liquidizer Ultra Dousing Accessory");
cliExecute("create 1 pro skateboard");
cliExecute("create 1 spitball");
cliExecute("create 1 wet shower radio");

// Equip a thing 
checkThenEquip("acc3",toItem("Flash Liquidizer Ultra Dousing Accessory"));

// // Buffs to cast
// const CASTBUFFS = [
//     toEffect('Elemental Saucesphere'),
//     toEffect('Astral Shell'),
//     toEffect("Singer's Faithful Ocelot"),
//     toEffect("Empathy"),
//     toEffect("Leash of Linguini"),
//     toEffect("Springy Fusilli"),
//     toEffect("Phat Leon's Phat Loot Lyric"),
//     toEffect("Polka of Plenty"),
//     toEffect("Chorale of Companionship"),
//     toEffect("Ballad of Richie Thingfinder"),
// ];

// /**
//  * Executes restoration when necessary. Uses a 25% or 300 HP/MP threshold.
//  */
// function restoration() {
//     var targetRaw = 100;

//     // Just use CLIex if needed for buffing... may not need?
//     while (myMp() < targetRaw) cliExecute('cast 1 Rest upside down');
//     return;

// }
