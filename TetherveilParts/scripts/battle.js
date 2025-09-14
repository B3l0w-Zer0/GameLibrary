let spielerHp = 100;
let monsterHp = 80;

function angreifen(){
    let schaden = zufallsSchaden(5, 10);
    let kritisch = criticalHit;

    if(kritisch){
        schaden *= 2;
        zeigeNachricht("ein kritischer Treffer wurde gelandet. Es wurde: " +  schaden + " angerichtet");
    }
    else{
        zeigeNachricht("Du hast "+ schaden + "angerichtet")
    }
    monsterHp -= schaden;
    if(monsterHp <= 0) {
        monsterHp = 0

    }
    aktualisieren();

    if (monsterHp > 0){
        setTimeout(monsterAttack(), 2000);
    }
    else{
        zeigeNachricht("Das Monster wurde besiegt! Glückwunsch!");
    }
}

function monsterAttack(){
    let monsterSchaden = zufallsSchaden(3, 9);
    let monsterCrit = criticalHit();

    if(monsterCrit){
        monsterschaden *= 2;
        zeigeNachricht("Du wurdest kritisch getroffen! Es wurde " + monsterSchaden + " angerichtet");
    }
    else{
        zeigeNachricht("Du wurdest mit " + monsterSchaden + " Schaden getroffen");
    }

    spielerHp -= monsterSchaden;
    if(spielerHp < 0) spielerHp = 0;

    aktualisieren();

    if(spielerHp <= 0 ){
        zeigeNachricht("Oh nein, du wurdest besiegt!");
    }

}

function heilen(){
    spielerHp += 7;
    if(spielerHp > 100) spielerHp = 100;
    if(spielerHp < 0) spielerHp = 0;
    aktualisieren();
    zeigeNachricht("Du heilst dich")
}

function ausweichen() {
    zeigeNachricht("Du versuchst auszuweichen...");

    // Zeitbalken zeigen
    const feld = document.getElementById("ausweichen-feld");
    const leiste = document.getElementById("timer-leiste");

    feld.style.display = "block";
    leiste.style.width = "100%";

    // Starte Animation (CSS-Transition)
    setTimeout(() => {
        leiste.style.width = "0%";
    }, 50); // kurzer Delay, damit Animation startet

    // Nach 3 Sekunden prüfen, ob der Spieler erfolgreich war
    setTimeout(() => {
        feld.style.display = "none"; // Zeitfeld wieder ausblenden

        let erfolgreich = Math.random() < 0.5; // 50% Chance auszuweichen

        if (erfolgreich) {
            zeigeNachricht("Du bist dem Angriff entkommen!");
        } else {
            zeigeNachricht("Das Monster trifft dich beim Ausweichen!");
            monsterGreiftAn();
        }

    }, 3000); // Dauer des Ausweichens
}

function aktualisieren(){
    document.getElementById("spieler-hp").innerText = "Held HP:" + spielerHp;
    document.getElementById("monster-hp").innerText = "Monster HP:" + monsterHp;
}

function zeigeNachricht(text){
    document.getElementById("nachricht").innerText = text;
}

function zufallsSchaden(min, max){
    return Math.floor(Math.random()*(max-min+1)) + min;
}

function criticalHit(){
    return Math.random() < 0.05;
}
