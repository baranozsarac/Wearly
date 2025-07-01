const userUpload = document.getElementById('user-upload');
const clothUpload = document.getElementById('cloth-upload');
const userImg = document.getElementById('user-img');
const clothImg = document.getElementById('cloth-img');
const scaleInput = document.getElementById('scale');
const generateBtn = document.getElementById('generate');
const resultImg = document.getElementById('result-img');
let dragging = false;
let offsetX = 0;
let offsetY = 0;
let net = null;

async function loadModel() {
  if (!net) {
    generateBtn.disabled = true;
    net = await bodyPix.load();
    generateBtn.disabled = false;
  }
}

userUpload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    userImg.src = URL.createObjectURL(file);
    userImg.hidden = false;
    loadModel();
  }
});

clothUpload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    clothImg.src = URL.createObjectURL(file);
    clothImg.hidden = false;
    clothImg.style.left = '0px';
    clothImg.style.top = '0px';
    clothImg.style.transform = 'scale(1)';
    scaleInput.value = 1;
    loadModel();
  }
});

clothImg.addEventListener('mousedown', e => {
  dragging = true;
  offsetX = e.offsetX;
  offsetY = e.offsetY;
});

document.addEventListener('mousemove', e => {
  if (!dragging) return;
  const rect = document.getElementById('canvas-container').getBoundingClientRect();
  clothImg.style.left = (e.clientX - rect.left - offsetX) + 'px';
  clothImg.style.top = (e.clientY - rect.top - offsetY) + 'px';
});

document.addEventListener('mouseup', () => {
  dragging = false;
});

scaleInput.addEventListener('input', e => {
  clothImg.style.transform = `scale(${e.target.value})`;
});

generateBtn.addEventListener('click', async () => {
  if (!userImg.src || !clothImg.src || !net) return;
  generateBtn.disabled = true;
  const container = document.getElementById('canvas-container');
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(userImg, 0, 0, cw, ch);

  const segmentation = await net.segmentPerson(userImg, {
    internalResolution: 'medium'
  });
  const mask = bodyPix.toMask(segmentation);
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = cw;
  maskCanvas.height = ch;
  const mctx = maskCanvas.getContext('2d');
  mctx.putImageData(mask, 0, 0);
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(maskCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-over';

  const cRect = clothImg.getBoundingClientRect();
  const contRect = container.getBoundingClientRect();
  const scaleX = cRect.width / contRect.width;
  const scaleY = cRect.height / contRect.height;
  const dx = cRect.left - contRect.left;
  const dy = cRect.top - contRect.top;
  ctx.drawImage(
    clothImg,
    dx / contRect.width * cw,
    dy / contRect.height * ch,
    scaleX * cw,
    scaleY * ch
  );

  resultImg.src = canvas.toDataURL('image/png');
  resultImg.hidden = false;
  generateBtn.disabled = false;
});
