const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const DATA_DIR = path.join(__dirname, 'data');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');
const PLAYLISTS_FILE = path.join(DATA_DIR, 'playlists.json');

// ensure folders
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// default gallery
const defaultImages = [
  'fotos/foto1.jpg',
  'fotos/foto2.jpg',
  'fotos/foto3.jpg'
];

async function readGallery(){
  try{
    const raw = await fsp.readFile(GALLERY_FILE, 'utf8');
    return JSON.parse(raw);
  } catch(e){
    await writeGallery(defaultImages);
    return defaultImages.slice();
  }
}

async function writeGallery(arr){
  await fsp.writeFile(GALLERY_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

async function readPlaylists(){
  try{
    const raw = await fsp.readFile(PLAYLISTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch(e){
    await writePlaylists([]);
    return [];
  }
}

async function writePlaylists(arr){
  await fsp.writeFile(PLAYLISTS_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

// multer for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.random().toString(36).slice(2,8);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});
const upload = multer({ storage });

// serve static public (including uploads)
app.use(express.static(PUBLIC_DIR));

// API endpoints
app.get('/api/gallery', async (req, res) => {
  const arr = await readGallery();
  res.json({ images: arr });
});

// Playlists endpoints
app.get('/api/playlists', async (req, res) => {
  const list = await readPlaylists();
  res.json({ items: list });
});

app.post('/api/playlists', async (req, res) => {
  const { url, title } = req.body;
  if(!url) return res.status(400).json({ error: 'url required' });
  const list = await readPlaylists();
  list.push({ url, title: title || '' });
  await writePlaylists(list);
  res.json({ ok:true, items: list });
});

app.delete('/api/playlists', async (req, res) => {
  const { index } = req.body;
  let list = await readPlaylists();
  if(typeof index === 'number'){
    if(index < 0 || index >= list.length) return res.status(400).json({ error:'index invalid' });
    list.splice(index,1);
  } else {
    return res.status(400).json({ error:'index required' });
  }
  await writePlaylists(list);
  res.json({ ok:true, items: list });
});

app.post('/api/gallery', async (req, res) => {
  const { url } = req.body;
  if(!url) return res.status(400).json({ error: 'url required' });
  const arr = await readGallery();
  arr.push(url);
  await writeGallery(arr);
  res.json({ ok:true, images: arr });
});

app.delete('/api/gallery', async (req, res) => {
  const { url, index } = req.body;
  let arr = await readGallery();
  if(typeof index === 'number'){
    if(index < 0 || index >= arr.length) return res.status(400).json({ error:'index invalid' });
    arr.splice(index,1);
  } else if(url){
    arr = arr.filter(i => i !== url);
  } else {
    return res.status(400).json({ error:'url or index required' });
  }
  await writeGallery(arr);
  res.json({ ok:true, images: arr });
});

// upload file endpoint - returns public URL
app.post('/api/upload', upload.single('file'), (req, res) => {
  if(!req.file) return res.status(400).json({ error: 'file required' });
  const publicUrl = '/uploads/' + req.file.filename;
  res.json({ ok:true, url: publicUrl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
