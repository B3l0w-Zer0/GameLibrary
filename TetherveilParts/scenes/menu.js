import {sounds, playSound} from '../scripts/sounds.js';

export function render(container, sceneManager) {
  // Wrapper für das ganze Menü
  const canvas = document.getElementById("gameCanvas");
  if (canvas) canvas.style.display = "none";

  const menuWrapper = document.createElement('div');
  menuWrapper.classList.add('menu-wrapper');

  // Titel
  const title = document.createElement('h1');
  title.innerText = 'Tetherveil';
  title.classList.add('menu-title');

  // Buttons
  const buttons = [
    { text: 'New Game', action: () => {playSound(sounds.click); sceneManager.loadScene('intro')} },
    {text: 'Shortcut', action:() => {playSound(sounds.click); sceneManager.loadScene('map')}},
    { text: 'Spielstand laden', action: () => {playSound(sounds.click); sceneManager.loadScene('load') }},
    { text: 'Optionen', action: () => {playSound(sounds.click); sceneManager.loadScene("options") }}
  ];

  const buttonGroup = document.createElement('div');
  buttonGroup.classList.add('menu-buttons');

  buttons.forEach(({ text, action }) => {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.classList.add('menu-button');
    btn.addEventListener('click', action);
    buttonGroup.appendChild(btn);
  });

  menuWrapper.appendChild(title);
  menuWrapper.appendChild(buttonGroup);
  container.appendChild(menuWrapper);
}