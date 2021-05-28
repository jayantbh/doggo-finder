const waitRAF = () => new Promise((resolve) => requestAnimationFrame(resolve));

export const waitFrame = async (frameCount = 1) => {
  while (frameCount--) {
    await waitRAF();
  }
};
