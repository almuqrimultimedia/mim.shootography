(function applySavedStudioTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const useDark = saved ? saved === "dark" : prefersDark;
  document.documentElement.classList.toggle("dark", useDark);
  document.documentElement.style.colorScheme = useDark ? "dark" : "light";
})();

function syncStudioThemeButtons() {
  const isDark = document.documentElement.classList.contains("dark");
  document.querySelectorAll("[data-theme-icon]").forEach(icon => {
    icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  });
  document.querySelectorAll("[data-theme-label]").forEach(label => {
    label.textContent = isDark ? "Mode terang" : "Mode gelap";
  });
}

function toggleStudioTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  syncStudioThemeButtons();
}

document.addEventListener("DOMContentLoaded", syncStudioThemeButtons);
