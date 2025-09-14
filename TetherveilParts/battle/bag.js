export function createBag() {

    let bagStatus = false;
    let isCategOpen = false; //idk what this is for but too scared to delete it XD
    let tempCurrentDiv = 'none'; //aktuelles Div element/Kategorienfeld
    let typeID = 'attack'; //um in "fillInventoryGrid" nur spezifische Kategorien anzuzeigen

    /*fetch("items.json")
        .then(res => res.json())
        .then(items => {
            console.log("Alle Items:", items);
        });
*/ //ist unnötig, weil ich schon loadItems gemacht hab

    //Allgemeiner Rahmen um den Bag herum v
    const bagWrapper = document.createElement('div');

    /*const categoriesWrapper = document.createElement('div'); categoriesWrapper.classList.add('bag-Category');*/

    //Display vom offenen bag v
    const bagOpen = document.createElement('div')
    bagOpen.classList.add('bag-open');

    //Knopf, der Inventar/bag öffnet v
    const bagButton = document.createElement('div');
    bagButton.classList.add('open-bag-btn');
    bagButton.addEventListener('click', e => {
        if (bagStatus === false) {
            bagOpen.style.display = 'flex';
            bagStatus = true;
            switchCategory(categAttack, allCategories)
        } else {
            bagOpen.style.display = 'none';
            bagStatus = false;
        }
    });

    //alle buttons der Kategorien in diesem Feld
    const categButtons = document.createElement('div');
    categButtons.classList.add('bag-categ-rahmen')
    bagButton.addEventListener('click', e => {
        bagWrapper.style.display = 'flex';
    });

    //Feld, welches Attack Items hat v
    const categAttack = document.createElement('div');
    categAttack.classList.add('bag-Category');


    //Feld, was Healing items hat v
    const categHealing = document.createElement('div');
    categHealing.classList.add('bag-Category');
    categHealing.style.backgroundColor = "red";

    //Feld, was special/status Healing hat v
    const categStatusHealing = document.createElement('div');
    categStatusHealing.classList.add('bag-Category');
    categStatusHealing.style.backgroundColor = 'blue';

    //Liste mit allen Item Kategorien
    const allCategories = [categAttack, categHealing, categStatusHealing]; /*switchCategory(categAttack, allCategories);*/

    //#01 Zuweisung der Kategorien mit Text, ID und Aktion,
    const categories = [{
        text: 'attack', id: 0, action: () => {
            bagOpen.appendChild(categAttack);
            switchCategory(categAttack, allCategories)
            /*categAttack.style.display = 'flex'*/
        }
    }, {
        text: 'healing', id: 1, action: () => {
            bagOpen.appendChild(categHealing);
            switchCategory(categHealing, allCategories) /*categHealing.style.display = 'flex'*/
        }
    }, {
        text: 'Status Healing', id: 2, action: () => {
            bagOpen.appendChild(categStatusHealing);
            switchCategory(categStatusHealing, allCategories)
            /*categAttack.style.display = 'flex'*/
        }
    },
    ]

    //Funktion, die zwischen Kategorien hin und herwechselt
    function switchCategory(newCateg, allCategories) {
        if (tempCurrentDiv === newCateg) {
            return; //wenn aktuelles div element, oder Kategorie Feld offen ist, mache einfach nichts
        }
        allCategories.forEach(e => e.style.display = 'none'); //schaltet alle vorherig aktiven Kategorien aus
        bagOpen.appendChild(newCateg); //schaltet nur die neue Kategorie an
        newCateg.style.display = 'flex'; //Wechsel zwischen grid und flex, noch nicht ausgearbeitet, lass es einfach mal stehen. Beides ist möglich
        tempCurrentDiv = newCateg;//Zuweisung der neuen Kategorie als current div element

        //achtung, jetzt sehr dumm und hässlich hard gecoded!! #02
        //hiermit habe ich die Kategorie ausgewählt und hard gecoded, die je nachdem, wo man hin switched, immer auch die richtige kategorie ausgewählt wird, um das dann in fill inventory aufzurufen und richtig alle items zu befüllen
        if (newCateg === categAttack) {
            typeID = 'attack';
        } else if (newCateg === categHealing) {
            typeID = 'healing';
        } else if (newCateg === categStatusHealing){
            typeID = 'statusHealing';
        }


        fillInventoryGrid(typeID)
    }

    /*function getCategID(getID){ return categories[getID].id; } function checkCateg(){ if(tempCurrentDiv === ) } */

    //Umwandelung, der oben in #01 festgelegten Werte der Felder zu einem button, bei dem text und action zugewiesen werden
    categories.forEach(({text, action}) => {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.classList.add('bag-categ-btn');
        btn.addEventListener('click', action);
        categButtons.appendChild(btn); //Hinzufügung der neuen Buttons zu den Buttons der Kategorien
    });


    //      <--ab hier nur noch Inventar stuff und Logik -->


//Raster hinzufügen, um Items in den slots darin zu lagern
    const itemGrid = document.createElement('div');
    itemGrid.classList.add('items-grid');

    //nur items im inventar anzeigen
    function loadInventory() {
        return JSON.parse(localStorage.getItem("inventory") || "[]");
    }
    //gesamte Item master file laden wo alle Infos zu allen items stehen
    async function loadItems() {
        const res = await fetch("./data/items/items.json");
        return await res.json();
    }


    //Funktion, um Item Grid zu befüllen und zu sortieren
    async function fillInventoryGrid(type){
        itemGrid.innerHTML = ""; //sorgt dafür, dass es immer vor dem neu befüllen geleert wird. Mega geil!
        const items = await loadItems();
        const inventory = loadInventory();
        const filteredInventory = inventory.filter(i => i.type === type);

        console.log("gefiltertes Inventory: ", filteredInventory);

        filteredInventory.sort((a, b) =>
            a.sortingID.localeCompare(b.sortingID));
        console.log("gefiltertes Inventory #2: ", filteredInventory);

        filteredInventory.forEach(invItem => {
            const itemDef = items.find(i => i.itemID === invItem.itemID);
            if (!itemDef) return; // Sicherheitscheck von GPT scheinbar good to have. Weiß aber nicht, was es macht

            // Item Div erstellen
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");

            // Name
            const itemName = document.createElement("h7");
            itemName.textContent = itemDef.name;
            itemDiv.appendChild(itemName);

            // Bild
            const itemImg = document.createElement("img");
            itemImg.src = itemDef.icon;
            itemImg.alt = itemDef.name;
            itemImg.style.width = "80px";
            itemImg.style.height = "80px";
            itemImg.style.objectFit = "contain";
            itemDiv.appendChild(itemImg);

            // Beschreibung
            const itemDesc = document.createElement("p");
            itemDesc.textContent = itemDef.description;
            itemDiv.appendChild(itemDesc);

            // Menge
            const itemQuant = document.createElement("p");
            itemQuant.textContent = `x${invItem.quantity}`;
            itemDiv.appendChild(itemQuant);

            // Use-Button
            const itemUseBtn = document.createElement("button");
            itemUseBtn.textContent = "Use";
            itemUseBtn.classList.add('menu-button')
            itemUseBtn.addEventListener("click", () => {
                useItem(invItem.itemID);     // ruft deine useItem-Funktion auf
                fillInventoryGrid(type);   // Grid nach Nutzung aktualisieren
            });
            itemDiv.appendChild(itemUseBtn);

            // Zum Grid hinzufügen
            itemGrid.appendChild(itemDiv);
            console.log("Grid wurde erstellt!");
        });
    }

    /*async function getFilteredInventory(type) {
        const items = await loadItems();
        const inventory = loadInventory();

        console.log("all items: ", items)
        // filtern
        const filteredInventory = inventory.filter(i => i.type === type);

        // sortieren
        filteredInventory.sort((a, b) =>
            a.sortingID.localeCompare(b.sortingID)
        );
        return { items, filteredInventory };
    }

// 2. DOM-Rendering
    async function fillInventoryGrid(type) {
        console.log("Grid wird neu gebaut mit Typ:", type);

        itemGrid.innerHTML = ""; // altes Grid löschen

        const { items, filteredInventory } = await getFilteredInventory(type);

        console.log("Gefiltertes Inventar:", filteredInventory);

        filteredInventory.forEach(invItem => {
            const itemDef = items.find(i => i.itemID === items.itemID);
            if (!itemDef) {
                console.warn("Kein ItemDef gefunden für:", invItem.itemID);
                return;
            }

            // Inhalte einfügen
            // Item Div erstellen
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");

            // Name
            const itemName = document.createElement("h7");
            itemName.textContent = itemDef.name;
            itemDiv.appendChild(itemName);

            // Bild
            const itemImg = document.createElement("img");
            itemImg.src = itemDef.icon;
            itemImg.alt = itemDef.name;
            itemDiv.appendChild(itemImg);

            // Beschreibung
            const itemDesc = document.createElement("p");
            itemDesc.textContent = itemDef.description;
            itemDiv.appendChild(itemDesc);

            // Menge
            const itemQuant = document.createElement("p");
            itemQuant.textContent = `x${invItem.quantity}`;
            itemDiv.appendChild(itemQuant);

            // Use-Button
            const itemUseBtn = document.createElement("button");
            itemUseBtn.textContent = "Use";
            itemUseBtn.classList.add('menu-button')
            itemUseBtn.addEventListener("click", () => {
                useItem(invItem.itemID);     // ruft deine useItem-Funktion auf
                fillInventoryGrid(type);   // Grid nach Nutzung aktualisieren
            });
            itemDiv.appendChild(itemUseBtn);

            // Button separat anhängen
            const btn = document.createElement("button");
            btn.textContent = "Use";
            btn.addEventListener("click", () => {
                useItem(invItem.itemID);
                fillInventoryGrid(type); // neu laden
            });
            itemDiv.appendChild(btn);

            // ins Grid hängen
            itemGrid.appendChild(itemDiv);
        });
    }*/


// Inventory speichern
    function saveInventory(inventory) {
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }

    //erstmal als prototyp von GPT.
    async function addItemToInventory(itemID){
        const items = await loadItems();
        let inventory = loadInventory();

        const itemDef = items.find(i => i.itemID === itemID);
        if (!itemDef) {
            console.log("Item nicht in Item Database!");
            return;
        }

        const invItem = inventory.find(i => i.itemID === itemID);

        if (invItem) {
            invItem.quantity += 1;
        } else {
            inventory.push({
                itemID: itemDef.itemID,
                quantity: 1,
                sortingID: itemDef.sortingID, // <- aus items.json
                type: itemDef.type            // <- aus items.json
            });
        }

        saveInventory(inventory);
        console.log("Added:", itemID);
        console.log("inventar nach hinzufügen: ", inventory);
    }

    async function useItem(itemID) {
        const items = await loadItems();
        const inventory = loadInventory();

        // Definition zum Item finden
        const itemDef = items.find(i => i.itemID === itemID);
        if (!itemDef) {
            console.warn("Kein ItemDef gefunden für:", itemID);
            return;
        }

        console.log("Benutze Item:", itemDef.name, "vom Typ:", itemDef.type);

        // je nach Typ unterschiedliche Funktionen aufrufen
        switch (itemDef.type) {
            case "attack":
                useAttackItem(itemDef);
                break;
            case "healing":
                useHealingItem(itemDef);
                break;
            case "specialHealing":
                useSpecialHealingItem(itemDef);
                break;
            default:
                console.warn("Unbekannter Typ:", itemDef.type);
        }

        // Danach Item aus Inventar entfernen
        removeItemFromInventory(itemID);
    }

    function useAttackItem(itemDef) {
        console.log(`Du greifst an und machst ${itemDef.damage} Schaden!`);
        // hier könnte dein Kampfsystem angesteuert werden
    }

    function useHealingItem(itemDef) {
        console.log(`Du heilst dich um ${itemDef.healAmount} HP!`);
        // hier könnte dein Player-HP hochgesetzt werden
    }

    function useSpecialHealingItem(itemDef) {
        console.log("Alle Status-Effekte wurden geheilt!");
        // hier Status-Clearing einbauen
    }

    //erstmal als prototyp von GPT.
    function removeItemFromInventory(itemID){
        let inventory = loadInventory();
        const invItem = inventory.find(i => i.itemID === itemID);

        if (!invItem) {
            console.log("Item nicht im Inventar!");
            return;
        }

        invItem.quantity -= 1;
        if (invItem.quantity <= 0) {
            inventory = inventory.filter(i => i.itemID !== itemID);
            console.log("deleted from inventory because there were none left: " + itemID);
        }

        saveInventory(inventory);
        console.log("used:", itemID, inventory);
    }

    async function initInventory() {
        await addItemToInventory("potionSmall");
        await addItemToInventory("swordBig");
        await addItemToInventory("sword");
        await addItemToInventory("executionerAxe");
        await addItemToInventory("testWrong");
        //await fillInventoryGrid("attack"); //auf jeden fall nötig, um am anfang immer attack laden zu lassen
    }

// Dann aufrufen:
    initInventory();


    bagOpen.appendChild(categButtons);
    bagOpen.appendChild(itemGrid);
    bagWrapper.appendChild(bagButton);
    bagWrapper.appendChild(bagOpen);
    console.log('bag wurde erstellt. fabio ist süß');
    return bagWrapper;

    /*addItemToInventory("potionSmall");
    addItemToInventory("henchmanAxe");
    addItemToInventory("sword");
    fillInventoryGrid("attack");
     */

}



//last updated: 9.9.2025

/*      <=== to do: ===>
- write a "useItem" function that can identify the item type and then concludes the effect and does that by reading the number and ID
- add the status effects to the add item function. Maybe we want to add an item that paralyzes and also heals paralysis etc. (also for poison and so on and so on)
- write more categories and items to complete your bag and test it
    - Utility
    - Defense
    - Quest
    - Valuables and/or collectibles
    - maybe it is already met with one of the former categories but also something for mons that evolve by item. maybe a single different categorie for that
    - would be cool to have a categorie that is hidden and that contains deep secrets and dark occult items that you can only unlock later and stays hidden until it revealed and then suddenly is unlocked to open in your bag
      or just have it with a "key" that you get to unlock the hidden "forbidden" item categorie to unlock it after a main quest
- write a function to add items to inventory by command line for proper testing


    !!=== for monsters in a different file ===!!
- for mons/vessels write following attributes:
    - name
    - type
    - physical Attack
    - physical Defense
    - soul Attack
    - soul Defense
    - speed
    - health
    - maybe catchrate and rarity for later implementation in high grass how likely they are to appear and to be caught
 ??   - i dont know where to asign the attacks, maybe here??
    - Description
        - ... more to come

- write function to add monsters from great monster database to monster inventory (monstInv) just like item inventory in local storage. That is your huge monster collection
- write a function that displays all the monsters in a grid like the items in your inventory and you can choose which one to pick. That mon gets switched into a new list that is just your team
- put 2 categories in your monster inventory div element bag thingy. One with every monster and one with only your team of 5. the general collection is sorted like all the items in a big grid
    and the team is listed under each other and more detailed which item it is carrying (to be done later), hp, name, bigger picture, etc

    so just copy every monster you collect into a big list like inventory (stored locally) and then do a second smaller list (maybe also stored locally) that you can access in your next functions to only call upon the mons in your team. Because it wouldnt make any sense to use
    an item in a fight on a monster that is not in your team, isn't it?

- write function to remove and change mons from your team (consisting of 5 mons)
- write function to remove monsters from monstInv completely in case you let them free or we need that later for quest purposes or shit like that
- write a certain special categorie where you only show the mons currently in your team. Do that with another kind of bag button. like just separately from your item bag a monster bag
    show the monsters in your monster bag (consisting of only 6 or 5 mons) like the item inventory bag. In a grid. Have a button to look at certain attributes and just look closer at the pixel art
- write function to equip one mon and also change it so just maybe a variable current mon where you put one mon object
- write function to read attack and all stats of current mon and figure out a cool balanced way to firstly get all the stats and then calculate damage dealt and taken based on those stats like e.g. 50 physical defense means what in calculating damage?
- write attack database where you every attack in the game and also a way to asign those (only 4) for each mon so they have a variety to choose from and do different damage based on attack stats and damage/ type of attack
- when being copied into your monstInv they get 4 or 5 (or how many you want xD) booleans to check for status effects (just like when doing that quantity thing variable when copying the items).
    So just implement if it gets poisoned, a special boolean gets activated and so you write another function to realize every effect
- ideas for effects:
    - paralysis
    - burn
    - poison
    - freeze
    - suffocating (maybe)
    - asleep
-> just write an automatic function for each of these where after (or before) every turn you check if the boolean of the current mon is activated then do what you implement and decide to be the effect of the status condition (e.g. take 10 damage for poison or loose 20 attack etc)
- write function to have the mons shown that have certain status effects when trying to use an item that clears that effect. So just if you try to use a para healer, you only get shown a div element with the mon inside to use it on
    (maybe just with something like the single items in the inventory bag also to use. Like just use a grid to show every mon that (after using a function to check if fitting) is hit by that status effect
- write a function that reads which mons have full hp and which do not. Only those with not full can use healing items. so just use the previously established method to only show a few.
    do that with a simple if statement and maybe for each?? Just like for each (mon) if hpCurrent < hpTotal ... and then just as prior defined, put it together into a div element and add it to the grid.
    That grid has to always be there so i think you can copy a lot from your bag logic with that opening of the bag and only then being able to interact with the mons. Only put that grid on flex when items are used so figure a way out for that too
    just to check if item use {grid.style = flex} I mean just like your item inventory bag just for monsters

for item categories also add TMs so that you can choose and change Attacks 

        <=== done: ===>
!- create 2nd json file called inventory.json
!- write function to transfer items from master file items.json to inventory.json via "add item to inventory function"
- write algorithm to get all items from inventory.json that have the specific type that you want to display. You already started doing that by putting the hard coded stuff in switchCategory function with tag #02
- write sorting algorithm to compare IDs of items (e.g. "sortingID": "002") of certain type and order them into a list
!- write algorithm that can also detect if one or more items of the same type and ID are in your inventory, thus having the item object in your json file 2 times
    but it adds those up and shows just 1 item in your list that has the fitting number of quantity next to it
    (find out if there is a problem with 2 identical items being present in your json file after being copied into your inventory again (after picking it up multiple times. I mean you can have more than 1 potion), because it may not know which one to use.
        maybe you have to add a little counter to that in a seperate function here that counts how many you already got by checking in the "addItemToInventory" function which items have already been transferred to your inventory,
            thus doing something with the counting and just not saving the new item only in the inventory.json file but also separately in a list where you can better access it, thus skipping
                the whole process of distinguishing every single item that is available more than once)
!- append each item together in one div with the image, description, name, quantity and use button (which is linked to the "useItem" function. You can use the css element "bag-catteg-rahmen" as a template for now just to test the functionality.
    But create a new one after you saw that it worked.
!- find out a way to fill these items into the slots in the inventory grid (I would say just make a div element out of each one of those and somehow append that to the grid)
!- Add "removeItemFromInventory" function to,... well just remove the item so you can't just infinitely use one item if you only have one. Also think about multiple items getting reduced by one. So you dont completely delete all items by ID after using one item
    if you have multiple. maybe use the list you possibly made before to track how many copies of a single item you have and reduce those by 1 per usage



- don't lose your mind (optional)

        -- CHANGELOG --
- 2nd json file was useless because we couldnt use it.
- wrote function to add and delete item to and from inventory

--save check 11:19--
 */