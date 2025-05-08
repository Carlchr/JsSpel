export const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };
  
  export function controls(bulletHandeler) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "w") keys.w = true;
      if (e.key === "s") keys.s = true;
      if (e.key === "a") keys.a = true;
      if (e.key === "d") keys.d = true;
  
      if (e.key === "ArrowUp") {
        keys.ArrowUp = true;
        bulletHandeler.direction = "up";
      }
      if (e.key === "ArrowDown") {
        keys.ArrowDown = true;
        bulletHandeler.direction = "down";
      }
      if (e.key === "ArrowLeft") {
        keys.ArrowLeft = true;
        bulletHandeler.direction = "left";
      }
      if (e.key === "ArrowRight") {
        keys.ArrowRight = true;
        bulletHandeler.direction = "right";
      }
    });
  
    document.addEventListener("keyup", (e) => {
      if (e.key === "w") keys.w = false;
      if (e.key === "s") keys.s = false;
      if (e.key === "a") keys.a = false;
      if (e.key === "d") keys.d = false;
  
      if (e.key === "ArrowUp") keys.ArrowUp = false;
      if (e.key === "ArrowDown") keys.ArrowDown = false;
      if (e.key === "ArrowLeft") keys.ArrowLeft = false;
      if (e.key === "ArrowRight") keys.ArrowRight = false;
    });
  }