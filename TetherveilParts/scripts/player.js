export class Player {
  constructor(name) {
    this.vesselHP = vessels
    this.vessels = [];
    this.inventory = [];
    this.direction = "none";
  }

  movePlayer() {

    /*function addItemToInventory(itemID) {
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

        if (item.type === "healing") {
            playerHP += item.healAmount;
        } else if (item.type === "attack") {
            enemyHP -= item.damage;
        }

        inventory.splice(index, 1);
        renderInventory();
    }
}*/

  }
}


