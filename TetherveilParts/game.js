import { SceneManager } from './scripts/sceneManager.js';


const gameContainer = document.getElementById('game');
const sceneManager = new SceneManager(gameContainer);
sceneManager.loadScene('menu');
