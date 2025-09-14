export function createMonstInv() {
    let monstInvStatus = false;
    let tempCurrentDiv = 'none';
    let type = "categTeam";
    let monstInfoStatus = false;


    //allgemeiner Rahmen um monster inventory wo alles stattfindet
    const monstInvWrapper = document.createElement('div')

    //Display von offenem monster inv
    const monstInvOpen = document.createElement('div')
    monstInvOpen.classList.add('monster-inv-open');

    //Knopf, der monst inv öffnet
    const monstInvBtn = document.createElement('div')
    monstInvBtn.classList.add('open-monster-inv-btn');
    monstInvBtn.addEventListener('click', e => {
        if (monstInvStatus === false) {
            monstInvOpen.style.display = 'flex';
            monstInvStatus = true;
            switchCategory(categTeam, allCategories)
        } else {
            monstInvOpen.style.display = 'none';
            monstInvStatus = false;
        }
    });

    //alle kategorie buttons hier drin
    const monstCategBtns = document.createElement('div');
    monstCategBtns.classList.add('monst-categ-rahmen')
    monstInvBtn.addEventListener('click', e => {
        monstInvWrapper.style.display = 'flex';
    });

    //Feld nur mit Team
    const categTeam = document.createElement('div');
    categTeam.classList.add('monst-category');

    //Feld mit allen mons
    const categCollection = document.createElement('div');
    categCollection.classList.add('monst-category');
    categCollection.style.backgroundColor = "orange";

    //Liste mit allen monst inventory Kategorien
    const allCategories = [categTeam, categCollection]; /*switchCategory(categAttack, allCategories);*/

    //#01 Zuweisung der Kategorien mit Text, ID und Aktion,
    const categories = [{
        text: 'Team', id: 0, action: () => {
            monstInvOpen.appendChild(categTeam);
            switchCategory(categTeam, allCategories)

        }
    },
        {
            text: 'All your Monsters', id: 1, action: () => {
                monstInvOpen.appendChild(categCollection);
                switchCategory(categCollection, allCategories)
            }
        }
    ]

    //Funktion, die zwischen Kategorien hin und herwechselt
    function switchCategory(newCateg, allCategories) {
        if (tempCurrentDiv === newCateg) {
            return; //wenn aktuelles div element, oder Kategorie Feld offen ist, mache einfach nichts
        }
        allCategories.forEach(e => e.style.display = 'none'); //schaltet alle vorherig aktiven Kategorien aus
        monstInvOpen.appendChild(newCateg); //schaltet nur die neue Kategorie an
        newCateg.style.display = 'flex'; //Wechsel zwischen grid und flex, noch nicht ausgearbeitet, lass es einfach mal stehen. Beides ist möglich
        tempCurrentDiv = newCateg;//Zuweisung der neuen Kategorie als current div element

        //achtung, jetzt sehr dumm und hässlich hard gecoded!! #02
        //hiermit habe ich die Kategorie ausgewählt und hard gecoded, die je nachdem, wo man hin switched, immer auch die richtige kategorie ausgewählt wird, um das dann in fill inventory aufzurufen und richtig alle items zu befüllen
        if (newCateg === categTeam) {
            fillTeamGrid();

        } else if (newCateg === categCollection) {
           fillCollectionGrid();

        }

    }

    categories.forEach(({text, action}) => {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.classList.add('monst-categ-btn');
        btn.addEventListener('click', action);
        monstCategBtns.appendChild(btn); //Hinzufügung der neuen Buttons zu den Buttons der Kategorien
    });

    //      <--ab hier nur noch vessel stuff und Logik -->

    async function loadAllMonsters() {
        const res = await fetch("./data/vessels/vessels.json");
        return await res.json();
    }

    function loadCollection() {
        return JSON.parse(localStorage.getItem("collection") || "[]");
    }

    function loadTeam() {
        return JSON.parse(localStorage.getItem("team") || "[]");
    }

    function saveCollection(collection) {
        localStorage.setItem("collection", JSON.stringify(collection));
    }

    function saveTeam(team) {
        localStorage.setItem("team", JSON.stringify(team));
    }

    //Grid für Monster
    const monstInvGridTeam = document.createElement('div');
    monstInvGridTeam.classList.add('monst-grid');

    const monstInvGridColl = document.createElement('div')
    monstInvGridColl.classList.add('monst-grid')

    //to add a mon to the great collection
    async function addMonToCollection(monsterID) {
        const allMons = await loadAllMonsters();
        let collection = loadCollection();

        const monDef = allMons.find(i => i.monsterID === monsterID);
        if (!monDef) {
            console.log("Mon nicht in Database!");
            return;
        }

        const mon = collection.find(i => i.monsterID === monsterID);

        // Anzahl dieses Monsters in der Collection zählen
        const duplicates = collection.filter(i => i.monsterID === monsterID).length;

        // Surrogate Key erzeugen (MonsterID + laufende Nummer)
        const surrogateID = `${monsterID}#${duplicates + 1}`;


        collection.push({
            surrogateID: surrogateID,
            monsterID: monDef.monsterID,
            monsterName: monDef.name,
            sortingID: monDef.sortingID,
            teamMember: false,
            type: monDef.type,
            health: monDef.health,
            physicalAttack: monDef.physicalAttack,
            physicalDefense: monDef.physicalDefense,
            soulAttack: monDef.soulAttack,
            soulDefense: monDef.soulDefense,
            speed: monDef.speed,
            description: monDef.description,
            isParalyzed: false,
            isBurnt: false,
            isAsleep: false,
            isFrozen: false,
            isPoisoned: false,
            }
        );
        saveCollection(collection);
        console.log("added to collection: ", monsterID);
        console.log("collection nach hinzufügen: ", collection);
    }


    //to add a mon from great collection to team
    async function addMonToTeam(surrogateID) {
        let collection = await loadCollection();
        let team = loadTeam();
        const monDef = collection.find(i => i.surrogateID === surrogateID);
        if (!monDef) {
            console.log("Mon nicht in Collection!", surrogateID);
            return;
        }

        // Prüfen, ob das Monster bereits im Team ist
        const alreadyInTeam = team.find(i => i.surrogateID === surrogateID);
        if (alreadyInTeam) {
            console.warn("Monster ist bereits im Team!");
            return;
        }

        if (team.length >= 5) {
            console.warn("Das Team ist voll");
            return;
        } else {
            team.push({
                surrogateID: monDef.surrogateID,
                monsterID: monDef.monsterID,
                monsterName: monDef.name,
                sortingID: monDef.sortingID,
                teamMember: true,
                type: monDef.type,
                health: monDef.health,
                physicalAttack: monDef.physicalAttack,
                physicalDefense: monDef.physicalDefense,
                soulAttack: monDef.soulAttack,
                soulDefense: monDef.soulDefense,
                speed: monDef.speed,
                description: monDef.description,
                isParalyzed: false,
                isBurnt: false,
                isAsleep: false,
                isFrozen: false,
                isPoisoned: false,
                inventory: [2],
                attacks: [5]
            });

            /*
                    const teamMon = {
                        ...monDef,  // alle Attribute aus JSON übernehmen
                        teamMember: true,
                        isParalyzed: false,
                        isBurnt: false,
                        isAsleep: false,
                        isFrozen: false,
                        isPoisoned: false,
                        currentHP: monDef.health   // wichtig: HP für Kämpfe dynamisch tracken
                    };*/
        }
        //team.push(teamMon);

        saveTeam(team);
        console.log("added to Team: ", surrogateID);
        console.log("team nach hinzufügen: ", team)
    }

    function removeMonFromTeam(surrogateID) {
        let team = loadTeam();
        const mon = team.find(i => i.surrogateID === surrogateID);

        if (!mon) {
            console.log("Monster nicht im Team!");
            return;
        }

        team = team.filter(i => i.surrogateID !== surrogateID);


        saveTeam(team);
        console.log("Removed from team:", surrogateID);
        console.log("aktuelles Team nach entfernen: ", team);
    }

    async function fillTeamGrid() {
        monstInvGridColl.innerHTML = '';
        monstInvGridTeam.innerHTML = ''
        let team = loadTeam();
        const collection = await loadCollection();
        const allMons = await loadAllMonsters();
        console.log("(fillTeamGrid check) Dein aktuelles Team ist: ", team)

        /*
        team.forEach(mon => {
            const monstDef = allMons.find(i => i.monsterID === mon.monsterID)
            if (!monstDef) return;
*/
        team.forEach(mon => {
            const monstDef = collection.find(i => i.surrogateID === mon.surrogateID)
            if (!monstDef) return;

            const helperMonstDef = allMons.find(i => i.monsterID === mon.monsterID)
            if (!helperMonstDef) return;


            // Monster-Div (eine Karte im Grid)
            const monstDiv = document.createElement("div");
            monstDiv.classList.add("monster-card");

            // Header-Bereich (oben: Name links, HP rechts)
            const header = document.createElement("div");
            header.classList.add("monster-header");

            // Name
            const nameEl = document.createElement("span");
            nameEl.textContent = monstDef.monsterName;

            // HP
            const hpEl = document.createElement("span");
            hpEl.textContent = `HP: ${monstDef.health}`;

            // Elemente in Header
            header.appendChild(nameEl);
            header.appendChild(hpEl);
            monstDiv.appendChild(header);

            // Bild
            const monstImg = document.createElement("img");
            monstImg.src = helperMonstDef.icon;
            monstImg.alt = helperMonstDef.monsterName;
            monstImg.style.width = "200px";
            monstImg.style.height = "200px";
            monstImg.style.objectFit = "contain";
            monstDiv.appendChild(monstImg);

            // Button-Bereich
            const btnContainer = document.createElement("div");
            btnContainer.classList.add("monster-buttons");

            //showInfo
            const infoBtn = document.createElement("button");
            infoBtn.textContent = "Show Info";
            infoBtn.addEventListener("click", () => {

                //hier fügst du ein, dass bitte ein großes Feld eingefügt wird, in dem alle Werte genau drin stehen, zusammen mit Bild, Stats, Attacken usw.

                console.log("info shown for: ", monstDef.monsterID);
            });

            // z. B. Remove Button
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove From Team";
            removeBtn.addEventListener("click", () => {
                removeMonFromTeam(monstDef.surrogateID);
                fillTeamGrid();
                console.log(monstDef.surrogateID, "removed!");
            });

            // Buttons in Container packen
            btnContainer.appendChild(infoBtn);
            btnContainer.appendChild(removeBtn);
            monstDiv.appendChild(btnContainer);

            // Jetzt monstDiv ins Grid anhängen
            monstInvGridTeam.appendChild(monstDiv);

            //
        })

    }

    async function fillCollectionGrid() {
        monstInvGridColl.innerHTML = ''
        monstInvGridTeam.innerHTML = ''
        let collection = loadCollection();
        const allMons = await loadAllMonsters();
        console.log("Deine aktuelle Collection ist: ", collection)

        collection.sort((a, b) =>
        a.sortingID.localeCompare(b.sortingID));
        console.log("(collectionGrid check) Geordnete Collection: ", collection);

        collection.forEach(mon => {
            /*const monstDefColl = allMons.find(i => i.monsterID === mon.monsterID)
            if (!monstDefColl) return;*/
            const monstDefColl = collection.find(i => i.surrogateID === mon.surrogateID)
            if(!monstDefColl) return;

            const helperMonstDef = allMons.find(i => i.monsterID === mon.monsterID)
            if (!helperMonstDef) return;


            // Monster-Div (eine Karte im Grid)
            const monstDivColl = document.createElement("div");
            monstDivColl.classList.add("monster-card");

            // Header-Bereich (oben: Name links, HP rechts)
            const headerColl = document.createElement("div");
            headerColl.classList.add("monster-header");

            // Name
            const nameElColl = document.createElement("span");
            nameElColl.textContent = monstDefColl.monsterName;

            // HP
            const hpElColl = document.createElement("span");
            hpElColl.textContent = `HP: ${monstDefColl.health}`;

            // Elemente in Header
            headerColl.appendChild(nameElColl);
            headerColl.appendChild(hpElColl);
            monstDivColl.appendChild(headerColl);

            // Bild
            const monstImgColl = document.createElement("img");
            monstImgColl.src = helperMonstDef.icon;
            monstImgColl.alt = helperMonstDef.monsterName;
            monstImgColl.style.width = "200px";
            monstImgColl.style.height = "200px";
            monstImgColl.style.objectFit = "contain";
            monstDivColl.appendChild(monstImgColl);

            // Button-Bereich
            const btnContainerColl = document.createElement("div");
            btnContainerColl.classList.add("monster-buttons");

            //showInfo
            const infoBtnColl = document.createElement("button");
            infoBtnColl.textContent = "Show Info";
            infoBtnColl.addEventListener("click", () => {

                //hier fügst du ein, dass bitte ein großes Feld eingefügt wird, in dem alle Werte genau drin stehen, zusammen mit Bild, Stats, Attacken usw.

                console.log("info shown for: ", monstDefColl.monsterID);
            });

            // Add to team Button
            const addToTeamBtn = document.createElement("button");
            addToTeamBtn.textContent = "Add to Team";
            addToTeamBtn.addEventListener("click", () => {
                addMonToTeam(monstDefColl.surrogateID);
                fillCollectionGrid();
                console.log("(collGrid removeBtn check)", monstDefColl.surrogateID, "added!");
            });

            // Buttons in Container packen
            btnContainerColl.appendChild(infoBtnColl);
            btnContainerColl.appendChild(addToTeamBtn);
            monstDivColl.appendChild(btnContainerColl);

            // Jetzt monstDiv ins Grid anhängen
            monstInvGridColl.appendChild(monstDivColl);

            //
        })

    }

    /*export async function createFillMonstGrid(type) {

        monstInvGridTeam.innerHTML = "";
        let monsters = [];

        if (type === categTeam) {
            monsters = loadTeam();
        } else if (type === categCollection) {
            monsters = loadCollection();
        } else if (type === healing) {
        } else {
            console.warn("nicht vorhandenes Anzeigeelement für MonsterRaster", type)
        }

        monsters.forEach(mon => {
            const monDiv = document.createElement("div");
            monDiv.classList.add("monster");

            // Name
            const monName = document.createElement("h3");
            monName.textContent = mon.name;
            monDiv.appendChild(monName);

            // Bild
            const monImg = document.createElement("img");
            monImg.src = mon.img;
            monImg.alt = mon.name;
            monDiv.appendChild(monImg);

            // Beschreibung
            const monDesc = document.createElement("p");
            monDesc.textContent = mon.description;
            monDiv.appendChild(monDesc);

            // HP (falls im Team)
            /*if (type === "team") {
                const status = document.createElement("p");
                status.textContent = `HP: ${mon.currentHP}/${mon.health}`;
                monDiv.appendChild(status);

                // Entfernen-Button
                const removeBtn = document.createElement("button");
                removeBtn.textContent = "Remove";
                removeBtn.addEventListener("click", () => {
                    removeMonFromTeam(mon.monsterID);
                    fillMonsterGrid("team");
                });
                monDiv.appendChild(removeBtn);

            } else if (mode === "collection") {
                // Button: ins Team packen
                const addBtn = document.createElement("button");
                addBtn.textContent = "Add to Team";
                addBtn.addEventListener("click", () => {
                    addMonToTeam(mon.monsterID);
                    fillMonsterGrid("team"); // Team direkt aktualisieren
                });
                monDiv.appendChild(addBtn);
            }

            monstInvGridTeam.appendChild(monDiv);

        });
    }*/



    /*        !!<<< AB HIER NUR NOCH INFO FELD FÜR MONSTER >>>!! */



    //Feld, was auf buttonclick aufgeht, um Info mit allen Stats, attacken und größerem Bild zu zeigen
    const monstInfoOpen = document.createElement('div');
    monstInfoOpen.classList.add("monster-info-card-open")


    function showMonstInfo(surrogateID){
        const team = loadTeam();
        const collection = loadCollection();

        const statsField = document.createElement('div');
        statsField.classList.add("info-card-monst-stats")

        const attacksField = document.createElement('div');
        attackField.classList.add("info-card-monst-attacks");

        const descriptField = document.createElement('div');
        descriptField.classList.add("info-card-monst-descript")

        const itemField = document.createElement('div');
        itemField

        monstInfoOpen.appendChild(statsField);
        monstInfoOpen.appendChild(attacksField);
        monstInfoOpen.appendChild(descriptField);

    }


    async function initMonInv(){
        await addMonToCollection("burntWitch");
        await addMonToCollection("burntWitch");
        await addMonToCollection("hahaTEstWrong");
        await addMonToTeam("burntWitch2");
    }

    initMonInv();



    monstInvOpen.appendChild(monstInvGridColl);
    monstInvOpen.appendChild(monstInvGridTeam);
    monstInvOpen.appendChild(monstCategBtns);
    monstInvWrapper.appendChild(monstInvBtn);
    monstInvWrapper.appendChild(monstInvOpen);
    console.log('monster inventar wurde erstellt. Jan ist süß');
    return monstInvWrapper;
}

/*
to do:
- div element that opens when using item (askind if you want to use that and then closes inventory)
- function that allows to switch one mon into active position (after switching monst inv closes)



last updated: 14.9.25 11:39
 */