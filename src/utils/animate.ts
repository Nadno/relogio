const startAnimate = (element: HTMLElement) => {
  const to = {
    transform: "translateY(32px)",
    opacity: 0,
  };
  const from = {
    transform: "translateY(0)",
    opacity: 1,
  };
  const options: KeyframeAnimationOptions = {
    duration: 200,
    fill: "forwards",
  };

  element.animate([to, from], options);
};

export default startAnimate;