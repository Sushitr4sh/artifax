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

const popupElements = document.querySelectorAll(".popup");
popupElements.forEach(function (popupElement) {
  popupElement.addEventListener("click", function () {
    const textChat = this.getAttribute("data-textChat");
    const currentChatId = this.getAttribute("data-currentChatId");
    const promptId = this.getAttribute("data-promptId");

    const editTextChat = document.getElementById("editTextChat");
    editTextChat.value = textChat;

    const editTextChatForm = document.getElementById("editTextChatForm");
    editTextChatForm.action = `/chats/${currentChatId}/prompts/${promptId}?_method=PUT`;

    document.getElementById("popup-container").classList.toggle("invisible");
    document.getElementById("popup-bg").classList.toggle("opacity-0");
    document.getElementById("popup-bg").classList.toggle("opacity-50");
  });
});

const popupCloseElements = document.querySelectorAll(".popup-close");
popupCloseElements.forEach(function (popupCloseElement) {
  popupCloseElement.addEventListener("click", function () {
    document.getElementById("popup-container").classList.toggle("invisible");
    document.getElementById("popup-bg").classList.toggle("opacity-0");
    document.getElementById("popup-bg").classList.toggle("opacity-50");
  });
});

$(window).on("load", function () {
  $(".loader-wrapper").fadeOut("slow");
  $("body").removeClass("preload");
});
