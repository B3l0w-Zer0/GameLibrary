import { createBag } from '../battle/bag.js';
import { createMonstInv } from '../battle/vessels.js'

export async function render(container, sceneManager) {
    const bagWrapper = createBag();
    const monstWrapper = createMonstInv();

    const canvas = document.getElementById("gameCanvas");
    if (canvas) canvas.style.display = "none";
    container.appendChild(bagWrapper);
    container.appendChild(monstWrapper);

}
