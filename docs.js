
// ═══════════════════════════════════════════════════════
// DOCUMENT MODAL
// ═══════════════════════════════════════════════════════
var _docB64=null, _docMime=null, _docFname=null, _docFile=null;
document.getElementById('doc-file').addEventListener('change', async function() {
  if (!this.files.length) return;
  var f=this.files[0]; _docMime=f.type; _docFname=f.name; _docFile=f;
  var pv=document.getElementById('doc-preview');
  if (f.type==='application/pdf') {
    if(pv) pv.innerHTML='<div style="background:rgba(232,160,32,.1);border-radius:10px;padding:13px;text-align:center;color:var(--amber)">📄 '+esc(f.name)+'</div>';
  } else {
    if(pv) pv.innerHTML='<img src="'+URL.createObjectURL(f)+'" style="width:100%;border-radius:12px;margin-top:10px">';
  }
});
function openDocModal(doc) {
  var edit=!!doc; _docB64=null; _docMime=null; _docFname=null; _docFile=null;
  var h='<div class="modal-title">'+(edit?'Edit':'Upload')+' Document</div>';
  if (!edit) {
    h+='<div class="upload-area" style="cursor:pointer"><div style="font-size:32px">📄</div><p>Add a document or photo</p><div style="display:flex;gap:8px;justify-content:center;margin-top:10px"><button onclick="showPhotoSourcePicker(null,\'doc\')" style="padding:7px 14px;border:none;background:var(--honey);color:#fff;border-radius:10px;font-family:inherit;font-size:13px;cursor:pointer">📷 Photo / Camera</button><button onclick="document.getElementById(\'doc-file\').click()" style="padding:7px 14px;border:none;background:rgba(74,44,10,.12);color:var(--bark);border-radius:10px;font-family:inherit;font-size:13px;cursor:pointer">📄 PDF</button></div></div><div id="doc-preview"></div>';
  }
  h+='<div class="fg"><label>Document Name</label><input id="f-dname" value="'+esc(doc?doc.name||'':'')+'" placeholder="e.g. State License 2025"></div>';
  h+='<div class="fg"><label>Category</label>'+makePills('dcat',['License','Certificate','Permit','Insurance','Inspection Report','Other'],doc?doc.category||'License':'License')+'</div>';
  h+='<div class="fg"><label>Expiry Date (optional)</label><input id="f-dexp" type="date" value="'+esc(doc?doc.expiry||'':'')+'"></div>';
  h+='<div class="fg"><label>Notes</label><input id="f-dnotes" value="'+esc(doc?doc.notes||'':'')+'" placeholder="Optional notes"></div>';
  h+='<button class="btn btn-p" onclick="saveDoc(\''+(edit?doc.id:'')+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Upload Document 📄')+'</button>';
  if (edit) h+='<button class="btn btn-d" onclick="deleteDoc(\''+doc.id+'\')">Delete Document</button>';
  h+='<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}
async function saveDoc(eid, isEdit) {
  var name=gv('f-dname');
  if (!name) { alert('Enter a document name'); return; }
  if (!isEdit && !_docFile) { alert('Please select a file to upload'); return; }
  var dataUrl = isEdit ? (DATA.docs.find(function(d){return d.id===eid;})||{}).dataUrl || '' : '';
  if (_docFile && _currentUser) {
    var ext = _docFile.name.split('.').pop().toLowerCase();
    var mime = _docFile.type || (ext==='pdf' ? 'application/pdf' : 'application/octet-stream');
    var ts = Date.now();
    var uploadPaths = [
      'assets/'+_currentUser.id+'/docs/'+ts+'.'+ext,
      'photos/'+_currentUser.id+'/doc-'+ts+'.'+ext,
      _currentUser.id+'/docs/'+ts+'.'+ext
    ];
    var uploaded = false; var lastErr = null;
    for (var i=0; i<uploadPaths.length; i++) {
      var res = await sb.storage.from('docs').upload(uploadPaths[i], _docFile, {upsert:true, contentType:mime});
      if (!res.error) {
        dataUrl = sb.storage.from('docs').getPublicUrl(uploadPaths[i]).data.publicUrl;
        uploaded = true; break;
      }
      lastErr = res.error;
    }
    if (!uploaded) { alert('Storage upload failed: '+(lastErr?lastErr.message:'Unknown error')); return; }
  }
  var _exp=gv('f-dexp');
  var obj={name,category:getPill('dcat'),expiry:_exp||null,notes:gv('f-dnotes'),data_url:dataUrl,mime:_docMime||'',file_name:_docFname||name};
  if (isEdit) {
    var {error:ue}=await sb.from('docs').update(obj).eq('id',eid).eq('user_id',_currentUser.id);
    if (ue) { alert('Save failed: '+ue.message); return; }
    Object.assign(DATA.docs.find(function(x){return x.id===eid;}),{...obj,dataUrl:obj.data_url});
  } else {
    var {data:row,error:ie}=await sb.from('docs').insert({...obj,user_id:_currentUser.id}).select().single();
    if (ie) { alert('Save failed: '+ie.message); return; }
    if (row) DATA.docs.push({...row,dataUrl:row.data_url});
  }
  closeModal(); renderAll();
}
function deleteDoc(id) {
  confirmDelete('Delete this document?', async function(){
    await dbDelete('docs',id); DATA.docs=DATA.docs.filter(function(d){return d.id!==id;}); renderAll();
  });
}
function openDlbox(doc) {
  document.getElementById('dlbox-name').textContent = doc.name;
  var img=document.getElementById('dlbox-img'), pdf=document.getElementById('dlbox-pdf');
  img.style.display='none'; pdf.style.display='none';
  if (doc.mime==='application/pdf') { pdf.src=doc.dataUrl; pdf.style.display=''; }
  else if (doc.dataUrl) { img.src=doc.dataUrl; img.style.display=''; }
  document.getElementById('dlbox-edit-btn').onclick=function(){closeDlbox();openDocModal(doc);};
  document.getElementById('dlbox-dl-btn').onclick=function(){var a=document.createElement('a');a.href=doc.dataUrl;a.download=doc.file_name||doc.name;a.click();};
  document.getElementById('dlbox').classList.add('open');
}
function closeDlbox() { document.getElementById('dlbox').classList.remove('open'); }

// ═══════════════════════════════════════════════════════
// ASSETS MODAL (Brand / Merch Graphics)
// ═══════════════════════════════════════════════════════
var _assetFile = null;
document.getElementById('asset-file').addEventListener('change', async function() {
  if (!this.files.length) return;
  _assetFile = this.files[0];
  var pv=document.getElementById('asset-preview');
  if (pv) pv.innerHTML='<img src="'+URL.createObjectURL(_assetFile)+'" style="width:100%;border-radius:12px;margin-top:10px;max-height:180px;object-fit:contain">';
});
function openAssetModal(asset) {
  var edit = !!asset; _assetFile = null;
  var h='<div class="modal-title">'+(edit?'Edit':'Upload')+' Brand Asset</div>';
  if (!edit) {
    h+='<div class="upload-area" onclick="showPhotoSourcePicker(null,\'asset\')"><div style="font-size:32px">🎨</div><p>Tap to upload logo, label design, or graphic</p><p style="font-size:11px;margin-top:4px;opacity:.65">JPG, PNG, SVG, GIF accepted</p></div><div id="asset-preview"></div>';
  }
  h+='<div class="fg"><label>Asset Name</label><input id="f-asname" value="'+esc(asset?asset.name||'':'')+'" placeholder="e.g. Primary Logo 2025"></div>';
  h+='<div class="fg"><label>Category</label>'+makePills('ascat',['Logo','Label Design','Banner','Social Media','Merchandise','Other'],asset?asset.category||'Logo':'Logo')+'</div>';
  h+='<div class="fg"><label>Notes</label><input id="f-asnotes" value="'+esc(asset?asset.notes||'':'')+'" placeholder="Optional description"></div>';
  h+='<button class="btn btn-p" onclick="saveAsset(\''+(edit?asset.id:'')+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Upload Asset 🎨')+'</button>';
  if (edit) h+='<button class="btn btn-d" onclick="deleteAsset(\''+asset.id+'\')">Delete</button>';
  h+='<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}
async function saveAsset(eid, isEdit) {
  var name=gv('f-asname');
  if (!name) { alert('Enter an asset name'); return; }
  if (!isEdit && !_assetFile) { alert('Please select a file to upload'); return; }
  var dataUrl = isEdit ? (DATA.assets.find(function(a){return a.id===eid;})||{}).data_url||'' : '';
  if (_assetFile && _currentUser) {
    var ext=_assetFile.name.split('.').pop();
    var path='assets/'+_currentUser.id+'/'+Date.now()+'.'+ext;
    var {error}=await sb.storage.from('docs').upload(path,_assetFile,{upsert:true});
    if (!error) { var {data}=sb.storage.from('docs').getPublicUrl(path); dataUrl=data.publicUrl; }
  }
  var obj={name,category:getPill('ascat'),notes:gv('f-asnotes'),data_url:dataUrl,file_name:_assetFile?_assetFile.name:name};
  if (isEdit) {
    await dbUpdate('assets',eid,obj); Object.assign(DATA.assets.find(function(x){return x.id===eid;}),obj);
  } else {
    var row=await dbInsert('assets',obj); if(row) DATA.assets.push(row);
  }
  closeModal(); renderAll();
}
function deleteAsset(id) {
  confirmDelete('Delete this asset?', async function(){
    await dbDelete('assets',id); DATA.assets=DATA.assets.filter(function(a){return a.id!==id;}); renderAll();
  });
}
