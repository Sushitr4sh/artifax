document.getElementById("hamburger").addEventListener("click", function () {
  document.getElementById("slideover-container").classList.toggle("invisible");
  document.getElementById("slideover").classList.toggle("-translate-x-full");
});
document
  .getElementById("hamburger-close")
  .addEventListener("click", function () {
    document
      .getElementById("slideover-container")
      .classList.toggle("invisible");
    document.getElementById("slideover").classList.toggle("-translate-x-full");
  });

document.getElementById("hamburger-2").addEventListener("click", function () {
  const newChat = document.querySelector("#newChat");
  newChat.classList.add(
    "border-emerald-500",
    "transition",
    "duration-[1000ms]",
    "ease-in",
  );
  setTimeout(() => {
    newChat.classList.remove("border-emerald-500");
    newChat.classList.add(
      "border-accentLight2",
      "transition",
      "duration-[500ms]",
      "ease-in",
    );
  }, 2000); // 2000 milliseconds = 2 seconds

  document.getElementById("slideover-container").classList.toggle("invisible");
  document.getElementById("slideover").classList.toggle("-translate-x-full");
});
