const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("lonava-theme");

if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  if (themeToggle) themeToggle.textContent = "Dark Mode";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    const isLightMode = document.body.classList.contains("light-mode");

    localStorage.setItem("lonava-theme", isLightMode ? "light" : "dark");
    themeToggle.textContent = isLightMode ? "Dark Mode" : "Light Mode";
  });
}