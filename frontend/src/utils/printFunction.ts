export function printFunction() {
  const savedTitle = document.title;
  document.title = `${window.location.hostname}-print`;
  function printSubcommand() {
    try {
      // https://stackoverflow.com/questions/31171099/window-print-does-not-work-in-safari
      // Print for Safari browser
      if (navigator.userAgent.indexOf("Safari") > -1) {
        document.execCommand("print", false, undefined);
      } else {
        window.print();
      }
    } catch {
      window.print();
    }
  }
  // document.body.style.setProperty("width", `${100 * window.devicePixelRatio}%`);
  // document.body.style.setProperty(
  //   "transform",
  //   `scale(${1 / window.devicePixelRatio})`
  // );
  // force to 0.5 when printing
  document.body.style.setProperty("width", `200%`);
  document.body.style.setProperty("transform", `scale(0.5)`);
  document.body.style.setProperty("transform-origin", "0 0");
  printSubcommand();
  document.body.style.setProperty("width", "100%");
  document.body.style.setProperty("transform", "scale(1)");
  document.body.style.setProperty("transform-origin", "0 0");
  document.title = savedTitle;
}
