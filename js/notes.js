// ═══════════════════════════════════════════════════════
// NOTES / RESOURCES — Supabase-backed (cross-device)
// ═══════════════════════════════════════════════════════
var _notesTab = 'all';
var NOTES_CATEGORIES = ['Feeding','Pest/Disease','DIY','Misc'];
var NOTE_CAT_KEY = { 'Feeding':'feeding', 'Pest/Disease':'pest', 'DIY':'diy', 'Misc':'misc' };
var NOTE_CAT_LABEL = { 'feeding':'🍯 Feeding', 'pest':'🐛 Pest/Disease', 'diy':'🔧 DIY', 'misc':'📖 Misc' };

var _notesCache = null;

async function _fetchNotesFromDB() {
  if (!_currentUser) return [];
  var { data, error } = await sb.from('user_notes').select('*').eq('user_id', _currentUser.id).order('created_at', { ascending: false });
  if (error) { console.error('fetchNotes:', error.message); return []; }
  return data || [];
}

async function _getNotesCache() {
  if (!_notesCache) _notesCache = await _fetchNotesFromDB();
  return _notesCache;
}

function resetNotesCache() { _notesCache = null; }

function showNotesTab(tab) {
  _notesTab = tab;
  ['all','feeding','pest','diy','misc'].forEach(function(t){
    var btn = document.getElementById('stn-'+t);
    if (btn) btn.classList.toggle('active', t === tab);
  });
  renderNotes();
}

async function renderNotes() {
  var el = document.getElementById('notes-list');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--txt2);font-size:13px">Loading…</div>';
  var notes = await _getNotesCache();
  var filtered = _notesTab === 'all' ? notes : notes.filter(function(n){ return NOTE_CAT_KEY[n.category] === _notesTab; });
  if (!filtered.length) {
    el.innerHTML = '<div class="empty"><div class="ei">📝</div><div class="et">No notes yet</div><div class="es">Tap + to add a recipe, formula, or reference note</div></div>';
    return;
  }
  el.innerHTML = filtered.map(function(n){
    var catKey = NOTE_CAT_KEY[n.category] || 'misc';
    return '<div class="note-card">'+
      '<span class="note-cat-tag nc-'+catKey+'">'+esc(NOTE_CAT_LABEL[catKey]||n.category)+'</span>'+
      '<div class="note-title">'+esc(n.title)+'</div>'+
      (n.source?'<div class="note-source">📚 Source: '+esc(n.source)+'</div>':'')+
      '<div class="note-body">'+esc(n.body)+'</div>'+
      '<div class="note-actions">'+
        '<button class="del-btn" onclick="openNoteModal(\''+n.id+'\')">✏️ Edit</button>'+
        '<button class="del-btn" onclick="deleteNote(\''+n.id+'\')">🗑 Delete</button>'+
      '</div>'+
    '</div>';
  }).join('');
}

async function openNoteModal(noteId) {
  var note = null;
  if (noteId) {
    var notes = await _getNotesCache();
    note = notes.find(function(n){ return n.id === noteId; }) || null;
  }
  var edit = !!note;
  var h = '<div class="modal-title">'+(edit?'Edit':'Add')+' Note / Resource</div>';
  h += '<div class="fg"><label>Title</label><input id="f-ntitle" value="'+esc(note?note.title||'':'')+'" placeholder="e.g. 2:1 Syrup for Fall Feeding"></div>';
  h += '<div class="fg"><label>Category</label>'+makePills('ncat',NOTES_CATEGORIES,note?note.category||'Feeding':'Feeding')+'</div>';
  h += '<div class="fg"><label>Source (book, website, etc.)</label><input id="f-nsource" value="'+esc(note?note.source||'':'')+'" placeholder="e.g. The Beekeeper\'s Bible, p.142"></div>';
  h += '<div class="fg"><label>Notes / Recipe / Formula</label><textarea id="f-nbody" style="min-height:160px">'+esc(note?note.body||'':'')+'</textarea></div>';
  h += '<button class="btn btn-p" onclick="saveNote(\''+(edit?note.id:'')+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Add Note 📝')+'</button>';
  if (edit) h += '<button class="btn btn-d" onclick="deleteNote(\''+note.id+'\')">Delete</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}

async function saveNote(noteId, isEdit) {
  var title = gv('f-ntitle');
  if (!title) { alert('Enter a title'); return; }
  var obj = { title:title, category:getPill('ncat')||'Misc', source:gv('f-nsource'), body:gv('f-nbody') };
  if (isEdit) {
    var { error } = await sb.from('user_notes').update(obj).eq('id', noteId).eq('user_id', _currentUser.id);
    if (error) { alert('Save failed: '+error.message); return; }
    var notes = await _getNotesCache();
    var idx = notes.findIndex(function(n){ return n.id === noteId; });
    if (idx >= 0) Object.assign(notes[idx], obj);
  } else {
    var { data:row, error:ie } = await sb.from('user_notes').insert({ ...obj, user_id:_currentUser.id }).select().single();
    if (ie) { alert('Save failed: '+ie.message); return; }
    if (row) { _notesCache = _notesCache || []; _notesCache.unshift(row); }
  }
  closeModal();
  renderNotes();
}

async function deleteNote(id) {
  confirmDelete('Delete this note?', async function(){
    await sb.from('user_notes').delete().eq('id', id).eq('user_id', _currentUser.id);
    _notesCache = (_notesCache||[]).filter(function(n){ return n.id !== id; });
    renderNotes();
  });
}
