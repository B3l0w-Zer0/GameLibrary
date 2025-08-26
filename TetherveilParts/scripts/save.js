export function saveGame(playerData) {
  localStorage.setItem('theterveilSave', JSON.stringify(playerData));
}

export function loadGame() {
  const data = localStorage.getItem('theterveilSave');
  return data ? JSON.parse(data) : null;
}
