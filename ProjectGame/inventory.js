/*import itemDatabase from './item-database.js';

export let inventory = [];

export function addItemToInventory(itemID) {
  const itemTemplate = itemDatabase[itemID];
  if (itemTemplate) {
    const itemCopy = { ...itemTemplate };
    inventory.push(itemCopy);
    renderInventory();
  }
}

export function renderInventory() {
  const list = document.querySelector(".item-list");
  list.innerHTML = "";

  inventory.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<img src="${item.icon}" alt="${item.name}" title="${item.description}">`;
    li.onclick = () => useItem(index);
    list.appendChild(li);
  });
}

export function useItem(index) {
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
*/