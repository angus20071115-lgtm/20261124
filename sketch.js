let bgImage; // 儲存背景圖片 bg/3.png[cite: 1]
let bgOffsetX = 0; // 記錄背景水平捲動偏移量（負值代表背景往左移動）[cite: 1]
let characterSprite; // 儲存角色一的精靈圖[cite: 1]
let walkSprite; // 儲存角色一的走路精靈圖[cite: 1]
let magicSprite; // 儲存角色一的施法精靈圖[cite: 1]
let magicEffectSprite; // 儲存角色一的魔法特效精靈圖[cite: 1]
let char2StopSprite; // 儲存角色二的站立精靈圖（2/stop/stop.png）
let char2ActionSprite; // 儲存角色二的動作精靈圖（2/action/action.png）

let characterX; // 儲存角色一目前的水平中心位置[cite: 1]
let isWalking = false; // 記錄角色是否已切換為走路動畫[cite: 1]
let facingDirection = 1; // 記錄角色朝向（1 為右，-1 為左）[cite: 1]
let isCasting = false; // 記錄角色是否正在播放施法動畫[cite: 1]
let magicStartFrame = 0; // 記錄施法動畫開始時的畫面計數[cite: 1]
let magicDirection = 1; // 記錄施法時鎖定的方向[cite: 1]
let spaceIsDown = false; // 記錄空白鍵是否已按住以避免重複觸發[cite: 1]
let activeEffects = []; // 儲存目前畫面上飛行中的魔法特效[cite: 1]

// 角色二接近狀態與化學選擇題狀態
let wasNearChar2 = false;
let currentQuiz = null;
let lastQuestionPrompt = "";
let selectedOptionIndex = null;
let quizFeedback = "";
let optionHitBoxes = []; // 儲存四個選項按鈕的點擊區域 { x, y, w, h, index }

const chemistryQuestionBank = [
  {
    prompt: "水（H₂O）的化學式是由哪兩種元素組成？",
    options: ["氫與氧", "碳與氧", "鈉與氯", "氫與氮"],
    answer: "氫與氧"
  },
  {
    prompt: "食鹽（氯化鈉）的主要化學式為何？",
    options: ["NaCl", "KCl", "CaCO₃", "NaOH"],
    answer: "NaCl"
  },
  {
    prompt: "在元素週期表中，符號「Fe」代表哪一種元素？",
    options: ["鐵", "氟", "金", "磷"],
    answer: "鐵"
  },
  {
    prompt: "二氧化碳的化學式為何？",
    options: ["CO₂", "CO", "SO₂", "CH₄"],
    answer: "CO₂"
  },
  {
    prompt: "常溫常壓下，哪一種氣體約占地球大氣體積的 78% 左右？",
    options: ["氮氣（N₂）", "氧氣（O₂）", "氦氣（He）", "二氧化碳（CO₂）"],
    answer: "氮氣（N₂）"
  },
  {
    prompt: "下列哪一種物質的水溶液呈酸性？",
    options: ["醋酸（CH₃COOH）", "氫氧化鈉（NaOH）", "氨水（NH₃·H₂O）", "碳酸氫鈉（NaHCO₃）"],
    answer: "醋酸（CH₃COOH）"
  },
  {
    prompt: "乾冰是下列哪一種物質的固態形式？",
    options: ["二氧化碳", "水", "氮氣", "甲烷"],
    answer: "二氧化碳"
  },
  {
    prompt: "元素符號「Au」代表哪一種貴金屬？",
    options: ["金", "銀", "鋁", "銅"],
    answer: "金"
  },
  {
    prompt: "下列哪一種變化屬於「化學變化」？",
    options: ["鐵生鏽", "冰塊融化", "酒精揮發", "食鹽溶於水"],
    answer: "鐵生鏽"
  },
  {
    prompt: "甲烷（CH₄）完全燃燒時，主要會產生哪兩種產物？",
    options: ["二氧化碳與水", "一氧化碳與氫氣", "氮氣與水", "碳粒與氧氣"],
    answer: "二氧化碳與水"
  }
];

const frameCountInSprite = 10; // 設定角色一精靈圖包含的影格數[cite: 1]
const frameWidth = 139.5; // 設定角色一每個影格的寬度（1395 除以 10）[cite: 1]
const frameHeight = 196; // 設定角色一每個影格的高度[cite: 1]
const walkFrameCount = 9; // 設定走路精靈圖包含的影格數[cite: 1]
const walkFrameWidth = 1246 / walkFrameCount; // 計算走路動畫每格的寬度[cite: 1]
const walkFrameHeight = 198; // 設定走路動畫每格的高度[cite: 1]
const magicFrameCount = 4; // 設定施法精靈圖包含的影格數[cite: 1]
const magicFrameWidth = 1039 / magicFrameCount; // 計算施法動畫每格的寬度[cite: 1]
const magicFrameHeight = 146; // 設定施法動畫每格的高度[cite: 1]
const effectFrameCount = 5; // 設定魔法特效精靈圖包含的影格數[cite: 1]
const effectFrameWidth = 740 / effectFrameCount; // 計算魔法特效每格的寬度[cite: 1]
const effectFrameHeight = 19; // 設定魔法特效每格的高度[cite: 1]
const framesPerStep = 8; // 設定動畫每隔幾個畫面更新一格[cite: 1]

// 角色二精靈圖參數
const char2StopFrameCount = 8; // 2/stop/stop.png 影格數
const char2StopTotalWidth = 699; // 2/stop/stop.png 全寬
const char2StopFrameWidth = char2StopTotalWidth / char2StopFrameCount; // 單格寬度
const char2StopFrameHeight = 190; // 2/stop/stop.png 高度

const char2ActionFrameCount = 12; // 2/action/action.png 影格數
const char2ActionTotalWidth = 1627; // 2/action/action.png 全寬
const char2ActionFrameWidth = char2ActionTotalWidth / char2ActionFrameCount; // 單格寬度
const char2ActionFrameHeight = 171; // 2/action/action.png 高度

function preload() { // 在畫布建立前載入圖片資源[cite: 1]
  bgImage = loadImage("bg/3.png"); // 載入背景圖片 bg/3.png[cite: 1]
  characterSprite = loadImage("1/stop/stop.png"); // 載入角色一的十格精靈圖[cite: 1]
  walkSprite = loadImage("1/walk/walk.png"); // 載入角色一的九格走路精靈圖[cite: 1]
  magicSprite = loadImage("1/magic/magic.png"); // 載入角色一的四格施法精靈圖[cite: 1]
  magicEffectSprite = loadImage("1/magic_effect/magic_effect.png"); // 載入五格魔法特效精靈圖[cite: 1]
  char2StopSprite = loadImage("2/stop/stop.png"); // 載入角色二的八格站立精靈圖
  char2ActionSprite = loadImage("2/action/action.png"); // 載入角色二的十二格動作精靈圖
}

function setup() { // 初始化畫布與繪圖模式[cite: 1]
  createCanvas(windowWidth, windowHeight); // 建立符合視窗尺寸的畫布[cite: 1]
  imageMode(CENTER); // 讓座標代表影格的中心點[cite: 1]
  characterX = (width * 2) / 3; // 將角色初始位置設在畫布寬度的三分之二處[cite: 1]
  frameRate(60); // 將動畫更新速率設定為每秒六十格[cite: 1]
  currentQuiz = generateChemistryQuiz();
}

function generateChemistryQuiz() {
  const candidates = chemistryQuestionBank.filter((item) => item.prompt !== lastQuestionPrompt);
  const pool = candidates.length > 0 ? candidates : chemistryQuestionBank;
  const picked = random(pool);
  lastQuestionPrompt = picked.prompt;

  const options = shuffle([...picked.options]);
  return {
    questionText: picked.prompt,
    options,
    correctIndex: options.indexOf(picked.answer)
  };
}

function submitAnswer(index) {
  if (!currentQuiz || index < 0 || index >= currentQuiz.options.length) return;
  selectedOptionIndex = index;
  if (index === currentQuiz.correctIndex) {
    quizFeedback = "答對了！";
  } else {
    quizFeedback = `再試一次（正確答案：${currentQuiz.options[currentQuiz.correctIndex]}）`;
  }
}

function drawChemistryQuizBox() {
  const boxW = width / 3; // 方框寬度為畫布寬的 1/3
  const boxH = height / 2; // 方框高度為畫布高的 1/2
  const boxX = (width - boxW) / 2; // 方框水平中間對準畫布中間
  const boxY = 12; // 方框上方靠近畫布上方

  optionHitBoxes = [];

  push();
  // 繪製透明度為 90 的黃色方框
  stroke(180, 140, 0, 200);
  strokeWeight(2);
  fill(255, 235, 59, 90);
  rect(boxX, boxY, boxW, boxH, 12);

  // 標題與化學題目文字
  const paddingX = max(14, boxW * 0.055);
  const titleSize = constrain(min(boxW * 0.06, boxH * 0.08), 14, 22);
  const questionSize = constrain(min(boxW * 0.058, boxH * 0.075), 14, 22);
  const questionAreaH = max(44, questionSize * 2.4);

  noStroke();
  fill(35, 35, 35, 240);
  textAlign(CENTER, TOP);
  textSize(titleSize);
  text("化學選擇題", boxX + boxW / 2, boxY + 10);

  textSize(questionSize);
  textStyle(BOLD);
  textLeading(questionSize * 1.25);
  text(
    currentQuiz.questionText,
    boxX + paddingX,
    boxY + 12 + titleSize * 1.25,
    boxW - paddingX * 2,
    questionAreaH
  );
  textStyle(NORMAL);

  // 2x2 選項按鈕區域
  const optionsTopY = boxY + 16 + titleSize * 1.25 + questionAreaH;
  const feedbackReserveH = max(24, boxH * 0.1);
  const optionsAreaH = max(80, boxY + boxH - optionsTopY - feedbackReserveH - 8);
  const gapX = max(8, boxW * 0.035);
  const gapY = max(8, optionsAreaH * 0.08);
  const optW = (boxW - paddingX * 2 - gapX) / 2;
  const optH = (optionsAreaH - gapY) / 2;
  const optTextSize = constrain(min(optW * 0.115, optH * 0.28), 12, 18);
  const labels = ["A", "B", "C", "D"];

  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = floor(i / 2);
    const ox = boxX + paddingX + col * (optW + gapX);
    const oy = optionsTopY + row * (optH + gapY);

    optionHitBoxes.push({ x: ox, y: oy, w: optW, h: optH, index: i });

    const isHovered = mouseX >= ox && mouseX <= ox + optW && mouseY >= oy && mouseY <= oy + optH;
    const isSelected = selectedOptionIndex === i;

    if (isSelected && i === currentQuiz.correctIndex) {
      fill(76, 175, 80, 215);
    } else if (isSelected) {
      fill(244, 67, 54, 205);
    } else if (isHovered) {
      fill(255, 255, 255, 235);
    } else {
      fill(255, 255, 255, 190);
    }

    stroke(90, 90, 90, 180);
    strokeWeight(1.5);
    rect(ox, oy, optW, optH, 8);

    noStroke();
    fill(25, 25, 25, 245);
    textAlign(CENTER, CENTER);
    textSize(optTextSize);
    textLeading(optTextSize * 1.2);
    text(
      `${labels[i]}. ${currentQuiz.options[i]}`,
      ox + 6,
      oy + 4,
      optW - 12,
      optH - 8
    );
  }

  // 作答回饋文字
  if (quizFeedback) {
    fill(20, 20, 20, 240);
    textAlign(CENTER, BOTTOM);
    textSize(constrain(min(boxW * 0.05, boxH * 0.07), 12, 18));
    text(quizFeedback, boxX + boxW / 2, boxY + boxH - 8);
  }

  pop();
}

function draw() { // 每個畫面更新一次背景與角色[cite: 1]
  background("#87CEEB"); // 預設底色避免圖片載入前空白[cite: 1]

  // 計算單張背景圖片依畫布高度等比例縮放後的寬度（確保至少與畫布同寬以完整覆蓋畫面）[cite: 1]
  const bgAspect = bgImage && bgImage.height > 0 ? bgImage.width / bgImage.height : 1;
  const singleBgWidth = max(width, height * bgAspect);
  const singleBgHeight = height;

  // 計算三張背景串接後的可捲動範圍[cite: 1]
  const minBgOffset = width - singleBgWidth * 2;
  const maxBgOffset = singleBgWidth;
  const anchorX = (width * 2) / 3; // 角色在捲動模式下的基準水平位置[cite: 1]

  const movingRight = keyIsDown(RIGHT_ARROW); // 檢查右方向鍵目前是否按住[cite: 1]
  const movingLeft = keyIsDown(LEFT_ARROW); // 檢查左方向鍵目前是否按住[cite: 1]
  isWalking = movingRight || movingLeft; // 沒有按住左右鍵時切回站立動畫[cite: 1]
  const movementStep = constrain(width * 0.004, 2, 8); // 依畫布寬度計算適合不同裝置的移動速度[cite: 1]

  // 維持角色一高度為畫布高度的 1/3，寬度依原圖寬高比等比例縮放[cite: 1]
  const characterScale = (height / 3) / frameHeight;
  const characterWidth = frameWidth * characterScale; // 計算角色基本顯示寬度[cite: 1]
  const characterHeight = height / 3;

  if (movingRight) { // 按住右方向鍵[cite: 1]
    isWalking = true; // 切換至走路動畫[cite: 1]
    facingDirection = 1; // 設定角色朝向右方[cite: 1]
    if (characterX < anchorX) {
      characterX = min(anchorX, characterX + movementStep);
    } else if (bgOffsetX > minBgOffset) {
      bgOffsetX = max(minBgOffset, bgOffsetX - movementStep);
    } else {
      characterX += movementStep; // 讓角色向右移動[cite: 1]
    }
  } else if (movingLeft) { // 按住左方向鍵[cite: 1]
    isWalking = true; // 切換至走路動畫[cite: 1]
    facingDirection = -1; // 設定角色朝向左方[cite: 1]
    if (characterX > anchorX) {
      characterX = max(anchorX, characterX - movementStep);
    } else if (bgOffsetX < maxBgOffset) {
      bgOffsetX = min(maxBgOffset, bgOffsetX + movementStep);
    } else {
      characterX -= movementStep; // 讓角色向左移動[cite: 1]
    }
  }

  // 限制角色一中心避免超出畫布左右邊界[cite: 1]
  characterX = constrain(characterX, characterWidth / 2, width - characterWidth / 2);

  // 繪製三張左右串接的背景圖片（左：i = -1，中：i = 0，右：i = 1）
  if (bgImage) {
    push();
    imageMode(CORNER); // 背景使用左上角座標對齊無縫串接
    for (let i = -1; i <= 1; i++) {
      const drawX = bgOffsetX + i * singleBgWidth;
      image(bgImage, drawX, 0, singleBgWidth, singleBgHeight);
    }
    pop();
  }

  // 計算角色二位置：位於最左邊背景圖（i = -1）的水平中心
  const leftMostBgLeftX = bgOffsetX - singleBgWidth;
  const char2X = leftMostBgLeftX + singleBgWidth / 2;

  // 判斷角色一是否接近角色二
  const proximityThreshold = max(140, characterWidth * 1.3);
  const isNearChar2 = abs(characterX - char2X) <= proximityThreshold;

  // 從遠離轉為接近時，產生新一題化學選擇題並重置作答狀態
  if (isNearChar2 && !wasNearChar2) {
    currentQuiz = generateChemistryQuiz();
    selectedOptionIndex = null;
    quizFeedback = "";
  }
  wasNearChar2 = isNearChar2;

  // 依接近狀態選擇角色二的精靈圖與影格參數（皆循環播放）
  const char2Sprite = isNearChar2 ? char2ActionSprite : char2StopSprite;
  const char2Count = isNearChar2 ? char2ActionFrameCount : char2StopFrameCount;
  const char2FrameW = isNearChar2 ? char2ActionFrameWidth : char2StopFrameWidth;
  const char2FrameH = isNearChar2 ? char2ActionFrameHeight : char2StopFrameHeight;

  const char2Scale = (height / 3) / char2StopFrameHeight; // 以站立高度為基準等比縮放
  const char2DrawW = char2FrameW * char2Scale;
  const char2DrawH = char2FrameH * char2Scale;
  const char2Y = height - char2DrawH / 2; // 底部對齊畫布底部
  const char2FrameIndex = floor(frameCount / framesPerStep) % char2Count;
  const char2SourceX = char2FrameIndex * char2FrameW;

  if (char2Sprite) {
    push();
    translate(char2X, char2Y);
    scale(characterX >= char2X ? 1 : -1, 1);
    image(char2Sprite, 0, 0, char2DrawW, char2DrawH, char2SourceX, 0, char2FrameW, char2FrameH);
    pop();
  }

  if (isCasting && frameCount - magicStartFrame >= magicFrameCount * framesPerStep) { // 檢查施法動畫是否已完整播放一次[cite: 1]
    isCasting = false; // 結束施法動畫並恢復一般角色動作[cite: 1]
    activeEffects.push({
      x: characterX + magicDirection * characterWidth / 2,
      y: height - characterHeight * 0.58,
      direction: magicDirection
    });
  }

  const activeSprite = isCasting ? magicSprite : isWalking ? walkSprite : characterSprite; // 根據角色狀態選擇施法、走路或站立精靈圖[cite: 1]
  const activeFrameCount = isCasting ? magicFrameCount : isWalking ? walkFrameCount : frameCountInSprite;
  const activeFrameWidth = isCasting ? magicFrameWidth : isWalking ? walkFrameWidth : frameWidth;
  const activeFrameHeight = isCasting ? magicFrameHeight : isWalking ? walkFrameHeight : frameHeight;
  const elapsedMagicFrames = frameCount - magicStartFrame;
  const frameIndex = isCasting ? floor(elapsedMagicFrames / framesPerStep) : floor(frameCount / framesPerStep) % activeFrameCount;
  const sourceX = frameIndex * activeFrameWidth;
  const activeWidth = activeFrameWidth * characterScale;
  const activeHeight = activeFrameHeight * characterScale;
  const characterY = height - activeHeight / 2; // 將目前角色影格底部對齊畫布底部[cite: 1]

  push();
  translate(characterX, characterY);
  scale(isCasting ? magicDirection : facingDirection, 1);
  image(activeSprite, 0, 0, activeWidth, activeHeight, sourceX, 0, activeFrameWidth, activeFrameHeight);
  pop();

  const effectScale = characterScale;
  const effectWidth = effectFrameWidth * effectScale;
  const effectHeight = effectFrameHeight * effectScale;
  const effectSpeed = max(6, width * 0.008);
  for (let effectIndex = activeEffects.length - 1; effectIndex >= 0; effectIndex--) {
    const effect = activeEffects[effectIndex];
    effect.x += effect.direction * effectSpeed;
    if (effect.x > width || effect.x < 0) {
      activeEffects.splice(effectIndex, 1);
      continue;
    }
    const effectFrameIndex = floor(frameCount / framesPerStep) % effectFrameCount;
    push();
    translate(effect.x, effect.y);
    scale(effect.direction, 1);
    image(magicEffectSprite, 0, 0, effectWidth, effectHeight, effectFrameIndex * effectFrameWidth, 0, effectFrameWidth, effectFrameHeight);
    pop();
  }

  // 角色一接近角色二時，在畫布上方中央顯示半透明黃色化學選擇題方框
  if (isNearChar2) {
    drawChemistryQuizBox();
  } else {
    optionHitBoxes = [];
  }
}

function mousePressed() {
  if (!wasNearChar2 || optionHitBoxes.length === 0) return;
  for (const box of optionHitBoxes) {
    if (mouseX >= box.x && mouseX <= box.x + box.w && mouseY >= box.y && mouseY <= box.y + box.h) {
      submitAnswer(box.index);
      break;
    }
  }
}

function keyPressed() { // 按下方向鍵時切換角色狀態與朝向[cite: 1]
  if (wasNearChar2) {
    if (key === "1" || key === "a" || key === "A") {
      submitAnswer(0);
      return false;
    }
    if (key === "2" || key === "b" || key === "B") {
      submitAnswer(1);
      return false;
    }
    if (key === "3" || key === "c" || key === "C") {
      submitAnswer(2);
      return false;
    }
    if (key === "4" || key === "d" || key === "D") {
      submitAnswer(3);
      return false;
    }
  }
  if (keyCode === RIGHT_ARROW) {
    isWalking = true;
    facingDirection = 1;
    return false;
  }
  if (keyCode === LEFT_ARROW) {
    isWalking = true;
    facingDirection = -1;
    return false;
  }
  if (keyCode === 32) {
    if (!spaceIsDown && !isCasting) {
      isCasting = true;
      magicStartFrame = frameCount;
      magicDirection = facingDirection;
    }
    spaceIsDown = true;
    return false;
  }
}

function keyReleased() { // 鍵盤按鍵放開時更新按鍵狀態[cite: 1]
  if (keyCode === 32) {
    spaceIsDown = false;
  }
}

function windowResized() { // 視窗尺寸改變時重新調整畫布[cite: 1]
  resizeCanvas(windowWidth, windowHeight);
  characterX = constrain(characterX, 1, width - 1);
}