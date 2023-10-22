const setHeight = () => {
  document.querySelector(".mobileScreen").style.minHeight =
    window.innerHeight + "px";
};

// define mobile screen size:

let deviceWidth = window.matchMedia("(max-width: 1024px)");

if (deviceWidth.matches) {
  // set an event listener that detects when innerHeight changes:

  window.addEventListener("resize", setHeight);

  // call the function once to set initial height:

  setHeight();
}
