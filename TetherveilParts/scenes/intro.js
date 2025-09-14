export function render(container, sceneManager) {
  const textAbschnitte = [
    "Once, the heavens bore more than clouds...\n" +
    "...they carried memory.",
    "The world turned beneath a silent vow:\n" +
    "That every soul, when its end had come, would rise…\n" +
    "and be received.",
    "But something shattered.\n" +
    "Not with thunder —\n" +
    "but with silence.",
    "And from that silence, the forgotten fell.\n" +
    "Souls without tether,\n" +
    "without purpose,\n" +
    "lost between life and forgetting.",
    "No fire consumed their bodies.\n" +
    "No grave bore their names.\n" +
    "Only longing remained —\n" +
    "and the slow rotting of meaning.",
    "But time is no mercy.\n" +
    "What does not rest begins to change.\n" +
    "And so eternity gnawed at their thoughts,\n" +
    "until nothing remained but hunger, wrath… and sorrow",
    "Some clung to objects —\n" +
    "to shadows, to beasts, to ruins,\n" +
    "forgetting who — or what — they once were.",
    "The land itself grew ill.\n" +
    "Roads refused the light.\n" +
    "Cities whispered in silence,\n" +
    "and from the stone crawled screams whose origins no longer had names.",
    "Now, the earth bends beneath their weight.\n" +
    "Forms twist. Voices fade.\n" +
    "The old paths crumble,\n" +
    "and the stars turn their gaze away.",
    "You awaken in this time of unraveling.\n" +
    "A whisper stirs in the dust.\n",
    "Not a calling...\n",
    "...but a remembering.\""
  ];

  let aktuellerIndex = 0;

  const canvas = document.getElementById("gameCanvas");
  if (canvas) canvas.style.display = "none";

  const wrapper = document.createElement('div');
  wrapper.className = 'intro-wrapper';

  const textElement = document.createElement('p');
  textElement.className = 'intro-text';
  textElement.textContent = textAbschnitte[aktuellerIndex];
  wrapper.appendChild(textElement);

  container.appendChild(wrapper);

  function zeigeNaechstenText() {
    aktuellerIndex++;
    if (aktuellerIndex < textAbschnitte.length) {
      textElement.textContent = textAbschnitte[aktuellerIndex];
    } else {
      // Listener entfernen, bevor Szene gewechselt wird
      wrapper.removeEventListener('click', zeigeNaechstenText);
      window.removeEventListener('keydown', handleKey);

      sceneManager.loadScene('map');
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') {
      zeigeNaechstenText();
    }
  }

  wrapper.addEventListener('click', zeigeNaechstenText);
  window.addEventListener('keydown', handleKey);
}