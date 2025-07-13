const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const status = document.getElementById('status');
const previewGrid = document.getElementById('preview-grid');

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

  context.translate(canvas.width, 0);
  context.scale(-1, 1);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL('image/png');

  // Ambil frame terakhir
  let lastFrame = previewGrid.lastElementChild;
  if (!lastFrame || lastFrame.children.length >= 3) {
    // Buat frame baru jika tidak ada atau sudah penuh
    const newFrame = document.createElement('div');
    newFrame.className = 'photo-frame';
    previewGrid.appendChild(newFrame);
    lastFrame = newFrame;

    // Maksimal 2 frame
    if (previewGrid.children.length > 2) {
      previewGrid.removeChild(previewGrid.firstChild);
    }
  }

  const img = document.createElement('img');
  img.src = dataUrl;
  lastFrame.appendChild(img);
});

document.getElementById('download-all').addEventListener('click', () => {
  const frames = document.querySelectorAll('.photo-frame');

  frames.forEach((frame, index) => {
    const images = frame.querySelectorAll('img');
    if (images.length === 0) return;

    const imgWidth = images[0].naturalWidth;
    const imgHeight = images[0].naturalHeight;

    // Buat canvas gabungan 3 gambar vertikal
    const canvas = document.createElement('canvas');
    canvas.width = imgWidth;
    canvas.height = imgHeight * images.length;

    const ctx = canvas.getContext('2d');

    images.forEach((img, i) => {
      ctx.drawImage(img, 0, i * imgHeight, imgWidth, imgHeight);
    });

    // Konversi canvas ke blob dan download
    canvas.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `frame-${index + 1}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, 'image/png');
  });
});