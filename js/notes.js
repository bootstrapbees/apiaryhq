// ═══════════════════════════════════════════════════════
// NOTES / RESOURCES
// ═══════════════════════════════════════════════════════
var _notesTab = 'all';
var NOTES_CATEGORIES = ['Feeding','Pest/Disease','DIY','Misc'];
var NOTE_CAT_KEY = { 'Feeding':'feeding', 'Pest/Disease':'pest', 'DIY':'diy', 'Misc':'misc' };
var NOTE_CAT_LABEL = { 'feeding':'🍯 Feeding', 'pest':'🐛 Pest/Disease', 'diy':'🔧 DIY', 'misc':'📖 Misc' };

function loadNotes() {
  try { return JSON.parse(localStorage.getItem('hkpro_notes') || '[]'); } catch(e) { return []; }
}
function saveNotes(notes) { localStorage.setItem('hkpro_notes', JSON.stringify(notes)); }

function showNotesTab(tab) {
  _notesTab = tab;
  ['all','feeding','pest','diy','misc'].forEach(function(t){
    var btn = document.getElementById('stn-'+t);
    if (btn) btn.classList.toggle('active', t === tab);
  });
  renderNotes();
}

function renderNotes() {
  var notes = loadNotes();
  var filtered = _notesTab === 'all' ? notes : notes.filter(function(n){ return NOTE_CAT_KEY[n.category] === _notesTab; });
  var el = document.getElementById('notes-list');
  if (!el) return;
  if (!filtered.length) {
    el.innerHTML = '<div class="empty"><div class="ei">📝</div><div class="et">No notes yet</div><div class="es">Tap + to add a recipe, formula, or reference note</div></div>';
    return;
  }
  el.innerHTML = filtered.map(function(n){
    var catKey = NOTE_CAT_KEY[n.category] || 'other';
    return '<div class="note-card">'+
      '<span class="note-cat-tag nc-'+catKey+'">'+esc(NOTE_CAT_LABEL[catKey]||n.category)+'</span>'+
      '<div class="note-title">'+esc(n.title)+'</div>'+
      (n.source?'<div class="note-source">📚 Source: '+esc(n.source)+'</div>':'')+
      '<div class="note-body">'+esc(n.body)+'</div>'+
      '<div class="note-actions">'+
        '<button class="del-btn" onclick="openNoteModal(loadNotes().find(function(x){return x.id===\''+n.id+'\';}))">✏️ Edit</button>'+
        '<button class="del-btn" onclick="deleteNote(\''+n.id+'\')">🗑 Delete</button>'+
      '</div>'+
    '</div>';
  }).join('');
}

function openNoteModal(note) {
  var edit = !!note;
  var h = '<div class="modal-title">'+(edit?'Edit':'Add')+' Note / Resource</div>';
  h += '<div class="fg"><label>Title</label><input id="f-ntitle" value="'+esc(note?note.title||'':'')+'" placeholder="e.g. 2:1 Syrup for Fall Feeding"></div>';
  h += '<div class="fg"><label>Category</label>'+makePills('ncat',NOTES_CATEGORIES,note?note.category||'Syrup Recipes':'Syrup Recipes')+'</div>';
  h += '<div class="fg"><label>Source (book, website, etc.)</label><input id="f-nsource" value="'+esc(note?note.source||'':'')+'" placeholder="e.g. The Beekeeper\'s Bible, p.142"></div>';
  h += '<div class="fg"><label>Notes / Recipe / Formula</label><textarea id="f-nbody" style="min-height:160px">'+esc(note?note.body||'':'')+'</textarea></div>';
  h += '<button class="btn btn-p" onclick="saveNote(\''+(edit?note.id:'')+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Add Note 📝')+'</button>';
  if (edit) h += '<button class="btn btn-d" onclick="deleteNote(\''+note.id+'\')">Delete</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}

function saveNote(eid, isEdit) {
  var title = gv('f-ntitle');
  if (!title) { alert('Enter a title'); return; }
  var notes = loadNotes();
  var obj = { title:title, category:getPill('ncat')||'Other', source:gv('f-nsource'), body:gv('f-nbody') };
  if (isEdit) {
    var idx = notes.findIndex(function(n){ return n.id === eid; });
    if (idx >= 0) { notes[idx] = Object.assign(notes[idx], obj); }
  } else {
    obj.id = 'n' + Date.now();
    notes.unshift(obj);
  }
  saveNotes(notes);
  closeModal();
  renderNotes();
}

function deleteNote(id) {
  confirmDelete('Delete this note?', function(){
    saveNotes(loadNotes().filter(function(n){ return n.id !== id; }));
    renderNotes();
  });
}
