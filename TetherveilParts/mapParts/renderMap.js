export function renderMap(onResizeCallback) {
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) {
    console.error("Canvas not found");
    return;
  }

  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (onResizeCallback) onResizeCallback();
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  return { canvas, ctx };
}
