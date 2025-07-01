const userUpload = document.getElementById('user-upload');
const clothUpload = document.getElementById('cloth-upload');
const userImg = document.getElementById('user-img');
const clothImg = document.getElementById('cloth-img');
const scaleInput = document.getElementById('scale');
let dragging = false;
let offsetX = 0;
let offsetY = 0;

userUpload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    userImg.src = URL.createObjectURL(file);
    userImg.hidden = false;
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
