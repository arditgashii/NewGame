let canvasSize = 925;
let canvasWidth = 1920;
const canvas = document.getElementById('mycanvas');
const app = new PIXI.Application({
  view: canvas,
  width: canvasWidth,
  height: canvasSize,
  backgroundColor: 0x5c812f,
});

let squareWidth = 32;
const square = new PIXI.Sprite(PIXI.Texture.WHITE);
square.anchor.set(0.5);
square.position.set(app.screen.width / 2, app.screen.height / 2);
square.width = square.height = squareWidth;
square.tint = 0xea985d;

app.stage.addChild(square);

const enemyRadius = 16;
const enemySpeed = 5;
const enemy = new PIXI.Graphics();
let r = randomSpawnPoint();
enemy.position.set(r.x, r.y);
enemy.beginFill(0xff0000, 1);
enemy.drawCircle(0, 0, enemyRadius);
enemy.endFill();
app.stage.addChild(enemy);

// Bullets
const bulletSpeed = 8;
const bulletRadius = 8;
const bullets = [];

function createBullet() {
  const bullet = new PIXI.Graphics();
  bullet.position.set(square.position.x, square.position.y);
  bullet.beginFill(0x0000ff, 1);
  bullet.drawCircle(0, 0, bulletRadius);
  bullet.endFill();

  const cursorPosition = app.renderer.plugins.interaction.mouse.global;
  const direction = new Victor(cursorPosition.x - square.position.x, cursorPosition.y - square.position.y).normalize();
  bullet.velocity = direction.multiplyScalar(bulletSpeed);

  bullets.push(bullet);
  app.stage.addChild(bullet);
}



function updateBullets() {
  bullets.forEach((bullet) => {
    bullet.position.set(bullet.position.x + bullet.velocity.x, bullet.position.y + bullet.velocity.y);


    const bulletPosition = new Victor(bullet.position.x, bullet.position.y);
    if (bulletPosition.distance(enemy.position) < enemyRadius) {

      app.stage.removeChild(bullet);
      bullets.splice(bullets.indexOf(bullet), 1);
      let r = randomSpawnPoint();
      enemy.position.set(r.x, r.y);
    }
  });
}




function handleShoot(e) {
  if (e.code === 'Space') {
    createBullet();
  }
}

window.addEventListener('keydown', handleShoot);

app.ticker.add((delta) => {
  const cursorPosition = app.renderer.plugins.interaction.mouse.global;
  let angle = Math.atan2(cursorPosition.y - square.y, cursorPosition.x - square.x) + Math.PI / 2;
  square.rotation = angle;

  let e = new Victor(enemy.position.x, enemy.position.y);
  let s = new Victor(square.position.x, square.position.y);
  if (e.distance(s) < squareWidth / 2) {
    let r = randomSpawnPoint();
    enemy.position.set(r.x, r.y);
    return;
  }

  let d = s.subtract(e);
  let v = d.normalize().multiplyScalar(enemySpeed);
  enemy.position.set(enemy.position.x + v.x, enemy.position.y + v.y);

  updateBullets();
});

function randomSpawnPoint() {
  let edge = Math.floor(Math.random() * 4);
  let spawnPoint = new Victor(0, 0);
  switch (edge) {
    case 0:
      spawnPoint.x = canvasSize * Math.random();
      break;
    case 1:
      spawnPoint.x = canvasSize;
      spawnPoint.y = canvasSize * Math.random();
      break;
    case 2:
      spawnPoint.x = canvasSize * Math.random();
      spawnPoint.y = canvasSize;
      break;
    case 3:
      spawnPoint.x = 0;
      spawnPoint.y = canvasSize * Math.random();
      break;
    default:
      break;
  }
  return spawnPoint;
}
