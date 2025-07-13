const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const status = document.getElementById('status');

navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
    status.textContent = '✅ Kamera aktif';
  })
  .catch((err) => {
    status.textContent = '❌ Kamera gagal: ' + err.message;
  });

document.getElementById('snap').addEventListener('click', () => {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Mirror gambar sesuai preview
  context.translate(canvas.width, 0);
  context.scale(-1, 1);

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  preview.src = canvas.toDataURL('image/png');
  preview.style.display = 'block';
});