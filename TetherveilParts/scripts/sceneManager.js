export class SceneManager {
  constructor(container) {
    this.container = container;
  }

  async loadScene(sceneName) {
    this.container.innerHTML = '';
    const sceneModule =  await import(`../scenes/${sceneName}.js`);
    sceneModule.render(this.container, this);
  }
}
