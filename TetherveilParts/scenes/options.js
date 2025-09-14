export function render(container, sceneManager) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('menu-wrapper');

  const title = document.createElement('h2');
  title.innerText = 'Optionen';
  title.classList.add('menu-title');

  // Container für Label + Zahl
  const volumeLabelContainer = document.createElement('div');
  volumeLabelContainer.style.display = 'flex';
  volumeLabelContainer.style.alignItems = 'center';
  volumeLabelContainer.style.marginBottom = '1vh';

  const volumeLabel = document.createElement('label');
  volumeLabel.innerText = 'Lautstärke:';
  volumeLabel.setAttribute('for', 'volume');

  // Anzeige der Lautstärkezahl direkt neben dem Label
  const volumeValue = document.createElement('span');
  volumeValue.innerText = localStorage.getItem('volume') || 50;
  volumeValue.style.marginLeft = '8px';
  volumeValue.style.fontWeight = 'bold';

  volumeLabelContainer.appendChild(volumeLabel);
  volumeLabelContainer.appendChild(volumeValue);

  const volumeSlider = document.createElement('input');
  volumeSlider.type = 'range';
  volumeSlider.id = 'volume';
  volumeSlider.min = 0;
  volumeSlider.max = 100;
  volumeSlider.value = localStorage.getItem('volume') || 50;
  volumeSlider.classList.add('menu-slider');

  volumeSlider.addEventListener('input', () => {
    localStorage.setItem('volume', volumeSlider.value);
    volumeValue.innerText = volumeSlider.value; // Zahl aktualisieren
    // Falls Audio vorhanden:
    // audioElement.volume = volumeSlider.value / 100;
  });

  const backButton = document.createElement('button');
  backButton.innerText = 'Zurück';
  backButton.classList.add('menu-button');
  backButton.addEventListener('click', () => sceneManager.loadScene('menu'));

  const buttonGroup = document.createElement('div');
  buttonGroup.classList.add('menu-buttons');
  buttonGroup.appendChild(volumeLabelContainer); // Label + Zahl als Gruppe
  buttonGroup.appendChild(volumeSlider);
  buttonGroup.appendChild(backButton);

  wrapper.appendChild(title);
  wrapper.appendChild(buttonGroup);
  container.appendChild(wrapper);
}
