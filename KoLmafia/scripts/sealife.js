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
if (inSea && itemAmount(toItem("sea chaps")) < 1) {
    takeStorage(1, toItem("mer-kin scholar mask"));
    takeStorage(1, toItem("mer-kin scholar tailpiece"));
    takeStorage(1, toItem("mer-kin gladiator mask"));
    takeStorage(1, toItem("mer-kin gladiator tailpiece"));
    takeStorage(1, toItem("shark jumper"));
    takeStorage(1, toItem("scale-mail underwear"));
    // takeStorage(1, toItem("sea cowboy hat"));
    // takeStorage(1, toItem("sea chaps"));
    // takeStorage(1, toItem("sea cowbell"));
    takeStorage(1, toItem("mer-kin wordquiz"));
    takeStorage(1, toItem("mer-kin cheatsheet"));
    takeStorage(1, toItem("mer-kin sneakmask"));
    takeStorage(1, toItem("Great Wolf's Beastly Trousers"));
}

// Use relevant stuff
if (inSea && itemAmount(toItem("mer-kin wordquiz")) > 0) use(1, toItem("mer-kin wordquiz"));
if (myLevel() > 19) use(1, toItem("wardrobe-o-matic"));
use(1, toItem("TakerSpace letter of Marque"));
use(1, toItem("Newbiesport&trade; tent"));
use(1, toItem("astral six-pack"));

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

// Some CLIEXes
cliExecute("breakfast");
cliExecute("find Sheriff pistol");
cliExecute("find Sheriff badge");
cliExecute("find Sheriff moustache");
cliExecute("photobooth effect wild");
cliExecute("mayam resonance stinkbomb");
cliExecute("mayam rings fur meat yam clock");
cliExecute("mayam rings chair wood wall yam");
cliExecute("leprecondo furnish padded,laptop,retro,workout");

// Create stuff
cliExecute("create 3 septapus charm");
cliExecute("create 1 wheel of camembert");
cliExecute("create 1 Spooky VHS Tape");
cliExecute("create 1 Flash Liquidizer Ultra Dousing Accessory");
cliExecute("create 1 pro skateboard");
cliExecute("create 1 spitball");
cliExecute("create 1 wet shower radio");
cliExecute("teatree shake");

// Equip a thing 
checkThenEquip("acc3",toItem("Flash Liquidizer Ultra Dousing Accessory"));

// Cast some buffs
cliExecute("cast 12 seal clubbing frenzy");
cliExecute("cast 12 sauce contemplation");
cliExecute("cast 12 patience of the tortoise");
cliExecute("cast 12 moxie of the mariachi");
cliExecute("cast 12 manicotti meditation");
cliExecute("cast 12 disco aerobics");
cliExecute("cast 1 summon kokomo reward pass");
cliExecute("cast 6 walberg's dim bulb");
cliExecute("cast 6 disco leer");
cliExecute("cast 6 springy fusilli");
cliExecute("cast 4 leash of linguini");
cliExecute("cast 6 singer's faithful ocelot");
cliExecute("cast 6 hide from seekers");
cliExecute("cast 6 smooth movement");
cliExecute("cast 1 Rest upside down");
cliExecute("cast 6 ballad of richie thingfinder");
cliExecute("cast 6 chorale of companionship");
cliExecute("cast 6 fat leon's phat loot lyric");
cliExecute("cast 6 sonata of sneakiness");
cliExecute("cast 1 Cincho: Party Soundtrack");

// Setting up cool-ass counters and stuff. Check the site for how-to when adding more.
//   -> https://wiki.kolmafia.us/index.php?title=Counters

cliExecute("counters add 0 rufusphone! hiero16.gif")
cliExecute("counters add 7 busk! prisberet.gif")

// Set the choice then use the goodies sack
cliExecute("set choiceAdventure1565=1");
visitUrl("council.php");
use(1, toItem("letter from King Ralph XI"));
use(1, toItem("pork elf goodies sack"));
cliExecute("sell * baconstone; sell * porquoise; sell * hamethyst;");

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
