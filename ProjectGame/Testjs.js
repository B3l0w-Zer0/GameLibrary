/* Irgendwie zerschießen mir die Imports hier meinen gesamten code!
import itemDatabase from 'item-database.js';
import { addItemToInventory, renderInventory, useItem } from 'inventory.js';

addItemToInventory("potion");
addItemToInventory("sword");
/*

*/

let playerMaxHP = 120;
let playerHP = playerMaxHP;

let enemyMaxHP = 80;
let enemyHP = enemyMaxHP;


function log(message) {
    const logBox = document.getElementById("log");
    logBox.innerHTML += message + "<br>";
    logBox.scrollTop = logBox.scrollHeight;
}


function updateHealthBars() {
    const playerPercent = (playerHP / playerMaxHP) * 100;
    const enemyPercent = (enemyHP / enemyMaxHP) * 100;

    document.getElementById("player-health").style.width = playerPercent + "%";
    document.getElementById("enemy-health").style.width = enemyPercent + "%";
}


function toggleBag() {
  const closed = document.querySelector('.bag-closed');
  const open = document.querySelector('.bag-open');
  if (open.style.display === 'none' || open.style.display === '') {
    open.style.display = 'block';
    closed.style.opacity = 0;
  } else {
    open.style.display = 'none';
    closed.style.opacity = 1;
  }
}


function playerAttack(){
    let damage;
    if(criticalHit()) {damage = 10; 
        log("Critical Hit!");
    }
    else {damage = 5;}
    enemyHP = enemyHP - damage;
    log(`Player attacks for ${damage} damage!`);
    disableButtons();
    setTimeout(enemyAttack, 500);
    updateHealthBars();
        
    }

function enemyAttack(){
   
    const enDamage = 5;
    playerHP = playerHP - enDamage;
    log(`enemy attacks for ${enDamage} damage!`);
    updateHealthBars();
    //setTimeout(enableButtons(), 1000);
    enableButtons();

}

function disableButtons() {
    document.querySelectorAll("button").forEach(btn => btn.disabled = true);
}

function enableButtons() {
    document.querySelectorAll("button").forEach(btn => btn.disabled = false);
}

function criticalHit(){
    return Math.random() < 0.2;
}

let inventory = [];

function addItemToInventory(itemID) {
  const itemTemplate = itemDatabase[itemID];
  if (itemTemplate) {
    const itemCopy = { ...itemTemplate };
    inventory.push(itemCopy);
    renderInventory();
  }
}

function renderInventory() {
  const list = document.querySelector(".item-list");
  list.innerHTML = "";

  inventory.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<img src="${item.icon}" alt="${item.name}" title="${item.description}">`;
    li.onclick = () => useItem(index);
    list.appendChild(li);
  });
}


function useItem(index) {
  const item = inventory[index];
  console.log(`Using ${item.name}`);

  // Beispielhafte Wirkung
  if (item.type === "healing") {
    playerHP += item.healAmount;
  } else if (item.type === "attack") {
    enemyHP -= item.damage;
  }

  inventory.splice(index, 1);
  renderInventory();
}


const itemDatabase = {
  potion: {
    itemID: "potion",
    name: "Potion",
    type: "healing",
    healAmount: 20,
    icon: "bottle.jpg",
    description: "Restores 20 HP"
  },
  sword: {
    itemID: "sword",
    name: "Sword",
    type: "attack",
    damage: 30,
    icon: "sword.jpg",
    description: "Deals 30 damage"
  },
  // Add more items here
};

    
addItemToInventory("potion");
addItemToInventory("sword");

    updateHealthBars();