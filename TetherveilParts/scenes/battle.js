import { createBag } from '../battle/bag.js';

export async function render(container, sceneManager) {
    const wrapper = createBag();

    const canvas = document.getElementById("gameCanvas");
    if (canvas) canvas.style.display = "none";
    container.appendChild(wrapper);

}

