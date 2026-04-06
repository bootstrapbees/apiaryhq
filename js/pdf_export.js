
// ═══════════════════════════════════════════════════════
// PDF EXPORT
// ═══════════════════════════════════════════════════════
function exportInspectionsPDF(hiveId) {
  if (typeof window.jspdf === 'undefined' && typeof jspdf === 'undefined') {
    alert('PDF library loading, please try again in a moment.'); return;
  }
  var {jsPDF} = window.jspdf || jspdf;
  var doc = new jsPDF({unit:'mm',format:'a4'});
  var apiaryName = document.getElementById('hdr-apiary-name').textContent || 'My Apiary';
  var filterHive = hiveId ? DATA.hives.find(function(h){return h.id===hiveId;}) : null;
  var reportTitle = filterHive
    ? apiaryName + ' — ' + filterHive.name + ' Inspections'
    : apiaryName + ' — All Hive Inspections';
  var pageW = doc.internal.pageSize.getWidth();
  var margin = 15; var y = 20;
  // Header
  doc.setFillColor(26, 58, 42);
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setTextColor(245, 223, 160);
  doc.setFontSize(18); doc.setFont('helvetica','bold');
  doc.text(reportTitle, margin, 12);
  doc.setFontSize(10); doc.setFont('helvetica','normal');
  doc.text('Generated: ' + new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), margin, 20);
  y = 38; doc.setTextColor(44, 26, 6);
  var allSorted = DATA.inspections.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  var sorted = hiveId ? allSorted.filter(function(i){return i.hiveId===hiveId;}) : allSorted;
  if (!sorted.length) {
    doc.setFontSize(12); doc.text('No inspection records found.', margin, y);
  }
  sorted.forEach(function(i) {
    if (y > 265) { doc.addPage(); y = 20; }
    var hive = DATA.hives.find(function(h){return h.id===i.hiveId;});
    // Card header
    doc.setFillColor(254, 249, 240); doc.roundedRect(margin, y, pageW-2*margin, 8, 2, 2, 'F');
    doc.setFontSize(12); doc.setFont('helvetica','bold'); doc.setTextColor(74, 44, 10);
    doc.text((hive?hive.name:'Unknown Hive') + ' — ' + fmtDate(i.date), margin+3, y+5.5);
    y += 11;
    doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(122, 88, 48);
    var line1 = 'Weather: '+(i.weather||'—')+' | Queen: '+(i.queenSeen||'—')+' | Temperament: '+(i.temperament||'—');
    doc.text(line1, margin+3, y);
    y += 5;
    var line2 = '⭐ Population: '+('⭐'.repeat(i.population||0)+'☆'.repeat(5-(i.population||0)))+' | Honey: '+('⭐'.repeat(i.honey||0)+'☆'.repeat(5-(i.honey||0)))+' | Brood: '+('⭐'.repeat(i.brood||0)+'☆'.repeat(5-(i.brood||0)));
    doc.text('Population: '+String(i.population||0)+' of 5   Honey Stores: '+String(i.honey||0)+' of 5   Brood: '+String(i.brood||0)+' of 5', margin+3, y);
    y += 5;
    if (i.varroa) { doc.text('Varroa: '+i.varroa, margin+3, y); y+=5; }
    if (i.actions) { var aLines=doc.splitTextToSize('Actions: '+i.actions, pageW-2*margin-6); doc.text(aLines, margin+3, y); y+=aLines.length*4.5; }
    if (i.notes) { doc.setTextColor(120,88,48); var nLines=doc.splitTextToSize('Notes: '+i.notes, pageW-2*margin-6); doc.text(nLines, margin+3, y); y+=nLines.length*4.5; }
    doc.setDrawColor(232,160,32); doc.setLineWidth(0.3); doc.line(margin, y+2, pageW-margin, y+2);
    y += 7;
  });
  // Footer
  doc.setTextColor(160,120,80); doc.setFontSize(8);
  doc.text('Apiary HQ — Inspection Records', margin, 290);
  var hivePart = filterHive ? '_'+filterHive.name.replace(/\s+/g,'_') : '_All_Hives';
  doc.save(apiaryName.replace(/\s+/g,'_')+hivePart+'_Inspections_'+new Date().toISOString().slice(0,10)+'.pdf');
}

function exportFinancePDF() {
  if (typeof window.jspdf === 'undefined' && typeof jspdf === 'undefined') {
    alert('PDF library loading, please try again.'); return;
  }
  var {jsPDF} = window.jspdf || jspdf;
  var doc = new jsPDF({unit:'mm',format:'a4'});
  var apiaryName = document.getElementById('hdr-apiary-name').textContent || 'My Apiary';
  var pageW = doc.internal.pageSize.getWidth();
  var margin = 15; var y = 20; var cur = _prefs.currency;
  // Header
  doc.setFillColor(26, 58, 42); doc.rect(0, 0, pageW, 28, 'F');
  doc.setTextColor(245, 223, 160);
  doc.setFontSize(18); doc.setFont('helvetica','bold');
  doc.text(apiaryName + ' — Financial Report', margin, 12);
  doc.setFontSize(10); doc.setFont('helvetica','normal');
  doc.text('Generated: ' + new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), margin, 20);
  y = 38;
  var income = DATA.transactions.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
  var expenses = DATA.transactions.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
  var net = income - expenses;
  // Summary box
  doc.setFillColor(254,249,240); doc.roundedRect(margin, y, pageW-2*margin, 24, 3, 3, 'F');
  doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(74,44,10);
  doc.text('Income: '+cur+income.toFixed(2), margin+5, y+8);
  doc.text('Expenses: '+cur+expenses.toFixed(2), margin+65, y+8);
  doc.setTextColor(net>=0?30:180, net>=0?100:50, net>=0?30:30);
  doc.text('Net P&L: '+cur+net.toFixed(2), margin+130, y+8);
  y += 30;
  // Transactions
  doc.setFontSize(13); doc.setFont('helvetica','bold'); doc.setTextColor(74,44,10);
  doc.text('Transactions', margin, y); y += 6;
  doc.setDrawColor(232,160,32); doc.setLineWidth(0.5); doc.line(margin, y, pageW-margin, y); y += 5;
  var sorted = DATA.transactions.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  sorted.forEach(function(t) {
    if (y > 272) { doc.addPage(); y = 20; }
    var isIncome = t.type==='income';
    doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(44,26,6);
    doc.text(fmtDate(t.date), margin, y);
    var descLines = doc.splitTextToSize(t.desc||'', 90);
    doc.text(descLines, margin+30, y);
    doc.setTextColor(isIncome?30:180, isIncome?100:50, isIncome?30:30);
    doc.setFont('helvetica','bold');
    doc.text((isIncome?'+':'-')+cur+parseFloat(t.amount).toFixed(2), pageW-margin-25, y);
    doc.setFont('helvetica','normal'); doc.setTextColor(120,88,48);
    doc.text(t.category||'', pageW-margin-55, y);
    y += descLines.length>1 ? descLines.length*4.5 : 6;
    doc.setDrawColor(232,160,32); doc.setLineWidth(0.1); doc.line(margin, y-1, pageW-margin, y-1);
  });
  doc.setTextColor(160,120,80); doc.setFontSize(8);
  doc.text('Apiary HQ — Financial Records', margin, 290);
  doc.save(apiaryName.replace(/\s+/g,'_')+'_Finance_'+new Date().toISOString().slice(0,10)+'.pdf');
}

// ═══════════════════════════════════════════════════════
// CSV EXPORTS
// ═══════════════════════════════════════════════════════
function csvEscape(val) {
  if (val === null || val === undefined) return '';
  var s = String(val).replace(/"/g, '""');
  return (s.includes(',') || s.includes('"') || s.includes('\n')) ? '"' + s + '"' : s;
}
function downloadCSV(filename, rows) {
  var csv = rows.map(function(r){ return r.map(csvEscape).join(','); }).join('\r\n');
  var blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
}

function exportInspectionsCSV(hiveId) {
  var apiaryName = document.getElementById('hdr-apiary-name').textContent || 'MyApiary';
  var filterHive = hiveId ? DATA.hives.find(function(h){return h.id===hiveId;}) : null;
  var allSorted = DATA.inspections.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  var rows = hiveId ? allSorted.filter(function(i){return i.hiveId===hiveId;}) : allSorted;
  var headers = ['Date','Hive','Queen Seen','Population (1-5)','Honey Stores (1-5)','Brood Pattern (1-5)','Varroa Level','Temperament','Weather','Fed Today','Feed Qty','Feed Notes','Actions Taken','Notes'];
  var data = [headers].concat(rows.map(function(i){
    var hive = DATA.hives.find(function(h){return h.id===i.hiveId;});
    return [
      i.date,
      hive ? hive.name : '',
      i.queenSeen || i.queen_seen || '',
      i.population || '',
      i.honey || '',
      i.brood || '',
      i.varroa || '',
      i.temperament || '',
      i.weather || '',
      i.feedType || i.feed_type || '',
      i.feedQty || i.feed_qty || '',
      i.feedNotes || i.feed_notes || '',
      i.actions || '',
      i.notes || ''
    ];
  }));
  var hivePart = filterHive ? '_'+filterHive.name.replace(/\s+/g,'_') : '_All_Hives';
  downloadCSV(apiaryName.replace(/\s+/g,'_')+hivePart+'_Inspections_'+new Date().toISOString().slice(0,10)+'.csv', data);
}

function exportFinanceCSV() {
  var apiaryName = document.getElementById('hdr-apiary-name').textContent || 'MyApiary';
  var sorted = DATA.transactions.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  var cur = _prefs.currency;
  var headers = ['Date','Type','Amount ('+cur+')','Description','Category','Notes','Vendor Name','Vendor Phone','Vendor Website'];
  var data = [headers].concat(sorted.map(function(t){
    return [
      t.date,
      t.type || '',
      t.amount || '',
      t.desc || t.description || '',
      t.category || '',
      t.notes || '',
      t.vendor_name || '',
      t.vendor_phone || '',
      t.vendor_website || ''
    ];
  }));
  downloadCSV(apiaryName.replace(/\s+/g,'_')+'_Finance_'+new Date().toISOString().slice(0,10)+'.csv', data);
}

function exportTreatmentsPDF(hiveId) {
  if (typeof window.jspdf === 'undefined' && typeof jspdf === 'undefined') {
    alert('PDF library loading, please try again in a moment.'); return;
  }
  var {jsPDF} = window.jspdf || jspdf;
  var doc = new jsPDF({unit:'mm',format:'a4'});
  var apiaryName = document.getElementById('hdr-apiary-name').textContent || 'My Apiary';
  var filterHive = hiveId ? DATA.hives.find(function(h){return h.id===hiveId;}) : null;
  var reportTitle = filterHive ? apiaryName + ' — ' + filterHive.name + ' Treatments' : apiaryName + ' — All Treatments';
  var pageW = doc.internal.pageSize.getWidth();
  var margin = 15; var y = 20;
  doc.setFillColor(26, 58, 42);
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setTextColor(245, 223, 160);
  doc.setFontSize(18); doc.setFont('helvetica','bold');
  doc.text(reportTitle, margin, 12);
  doc.setFontSize(10); doc.setFont('helvetica','normal');
  doc.text('Generated: ' + new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), margin, 20);
  y = 38; doc.setTextColor(44, 26, 6);
  var sorted = DATA.treatments.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  sorted = hiveId ? sorted.filter(function(t){return t.hiveId===hiveId;}) : sorted;
  if (!sorted.length) {
    doc.setFontSize(12); doc.text('No treatment records found.', margin, y);
  }
  sorted.forEach(function(t) {
    if (y > 265) { doc.addPage(); y = 20; }
    var hive = DATA.hives.find(function(h){return h.id===t.hiveId;});
    doc.setFillColor(254, 249, 240); doc.roundedRect(margin, y, pageW-2*margin, 8, 2, 2, 'F');
    doc.setFontSize(12); doc.setFont('helvetica','bold'); doc.setTextColor(74, 44, 10);
    doc.text((hive?hive.name:'Unknown') + ' — ' + fmtDate(t.date), margin+3, y+5.5);
    y += 11;
    doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(122, 88, 48);
    doc.text('Category: '+(t.category||'—')+' | Product: '+(t.product||'—'), margin+3, y); y+=5;
    if (t.duration) { doc.text('Duration: '+t.duration, margin+3, y); y+=5; }
    if (t.diseaseType||t.disease_type) { doc.text('Disease: '+(t.diseaseType||t.disease_type), margin+3, y); y+=5; }
    if (t.pestType||t.pest_type) { doc.text('Pest: '+(t.pestType||t.pest_type), margin+3, y); y+=5; }
    if (t.notes) { var nl=doc.splitTextToSize('Notes: '+t.notes, pageW-2*margin-6); doc.text(nl, margin+3, y); y+=nl.length*4.5; }
    doc.setDrawColor(232,160,32); doc.setLineWidth(0.3); doc.line(margin, y+2, pageW-margin, y+2);
    y += 7;
  });
  doc.setTextColor(160,120,80); doc.setFontSize(8);
  doc.text('Apiary HQ — Treatments', margin, 290);
  var hivePart = filterHive ? '_'+filterHive.name.replace(/\s+/g,'_') : '_All_Hives';
  doc.save(apiaryName.replace(/\s+/g,'_')+hivePart+'_Treatments_'+new Date().toISOString().slice(0,10)+'.pdf');
}

function exportTreatmentsCSV(hiveId) {
  var apiaryName = document.getElementById('hdr-apiary-name').textContent || 'MyApiary';
  var filterHive = hiveId ? DATA.hives.find(function(h){return h.id===hiveId;}) : null;
  var sorted = DATA.treatments.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  var rows = hiveId ? sorted.filter(function(t){return t.hiveId===hiveId;}) : sorted;
  var headers = ['Date','Hive','Category','Product','Duration','Pest Type','Disease Type','Notes'];
  var data = [headers].concat(rows.map(function(t){
    var hive = DATA.hives.find(function(h){return h.id===t.hiveId;});
    return [t.date, hive?hive.name:'', t.category||'', t.product||'', t.duration||'', t.pestType||t.pest_type||'', t.diseaseType||t.disease_type||'', t.notes||''];
  }));
  var hivePart = filterHive ? '_'+filterHive.name.replace(/\s+/g,'_') : '_All_Hives';
  downloadCSV(apiaryName.replace(/\s+/g,'_')+hivePart+'_Treatments_'+new Date().toISOString().slice(0,10)+'.csv', data);
}

function exportHarvestsPDF(hiveId) {
  if (typeof window.jspdf === 'undefined' && typeof jspdf === 'undefined') {
    alert('PDF library loading, please try again in a moment.'); return;
  }
  var {jsPDF} = window.jspdf || jspdf;
  var doc = new jsPDF({unit:'mm',format:'a4'});
  var apiaryName = document.getElementById('hdr-apiary-name').textContent || 'My Apiary';
  var filterHive = hiveId ? DATA.hives.find(function(h){return h.id===hiveId;}) : null;
  var reportTitle = filterHive ? apiaryName + ' — ' + filterHive.name + ' Harvests' : apiaryName + ' — All Harvests';
  var pageW = doc.internal.pageSize.getWidth();
  var margin = 15; var y = 20;
  doc.setFillColor(26, 58, 42);
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setTextColor(245, 223, 160);
  doc.setFontSize(18); doc.setFont('helvetica','bold');
  doc.text(reportTitle, margin, 12);
  doc.setFontSize(10); doc.setFont('helvetica','normal');
  doc.text('Generated: ' + new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), margin, 20);
  y = 38; doc.setTextColor(44, 26, 6);
  var sorted = DATA.harvests.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  sorted = hiveId ? sorted.filter(function(v){return v.hiveId===hiveId;}) : sorted;
  if (!sorted.length) {
    doc.setFontSize(12); doc.text('No harvest records found.', margin, y);
  }
  sorted.forEach(function(v) {
    if (y > 265) { doc.addPage(); y = 20; }
    var hive = DATA.hives.find(function(h){return h.id===v.hiveId;});
    doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(74, 44, 10);
    doc.text((hive?hive.name:'Unknown') + ' — ' + fmtDate(v.date) + ' — ' + v.yield + ' ' + (v.unit||''), margin+3, y);
    y += 6;
    doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(122, 88, 48);
    doc.text('Type: '+(v.type||'Honey'), margin+3, y); y+=5;
    if (v.notes) { var nl=doc.splitTextToSize('Notes: '+v.notes, pageW-2*margin-6); doc.text(nl, margin+3, y); y+=nl.length*4.5; }
    y += 4;
    doc.setDrawColor(232,160,32); doc.line(margin, y, pageW-margin, y);
    y += 6;
  });
  doc.setTextColor(160,120,80); doc.setFontSize(8);
  doc.text('Apiary HQ — Harvests', margin, 290);
  var hivePart = filterHive ? '_'+filterHive.name.replace(/\s+/g,'_') : '_All_Hives';
  doc.save(apiaryName.replace(/\s+/g,'_')+hivePart+'_Harvests_'+new Date().toISOString().slice(0,10)+'.pdf');
}

function exportHarvestsCSV(hiveId) {
  var apiaryName = document.getElementById('hdr-apiary-name').textContent || 'MyApiary';
  var filterHive = hiveId ? DATA.hives.find(function(h){return h.id===hiveId;}) : null;
  var sorted = DATA.harvests.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  var rows = hiveId ? sorted.filter(function(v){return v.hiveId===hiveId;}) : sorted;
  var headers = ['Date','Hive','Yield','Unit','Product Type','Notes'];
  var data = [headers].concat(rows.map(function(v){
    var hive = DATA.hives.find(function(h){return h.id===v.hiveId;});
    return [v.date, hive?hive.name:'', v.yield, v.unit||'', v.type||'', v.notes||''];
  }));
  var hivePart = filterHive ? '_'+filterHive.name.replace(/\s+/g,'_') : '_All_Hives';
  downloadCSV(apiaryName.replace(/\s+/g,'_')+hivePart+'_Harvests_'+new Date().toISOString().slice(0,10)+'.csv', data);
}

function exportFeedingsPDF(hiveId) {
  if (typeof window.jspdf === 'undefined' && typeof jspdf === 'undefined') {
    alert('PDF library loading, please try again in a moment.'); return;
  }
  var {jsPDF} = window.jspdf || jspdf;
  var doc = new jsPDF({unit:'mm',format:'a4'});
  var apiaryName = document.getElementById('hdr-apiary-name').textContent || 'My Apiary';
  var filterHive = hiveId ? DATA.hives.find(function(h){return h.id===hiveId;}) : null;
  var reportTitle = filterHive ? apiaryName + ' — ' + filterHive.name + ' Feeding' : apiaryName + ' — All Feeding';
  var pageW = doc.internal.pageSize.getWidth();
  var margin = 15; var y = 20;
  doc.setFillColor(26, 58, 42);
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setTextColor(245, 223, 160);
  doc.setFontSize(18); doc.setFont('helvetica','bold');
  doc.text(reportTitle, margin, 12);
  doc.setFontSize(10); doc.setFont('helvetica','normal');
  doc.text('Generated: ' + new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), margin, 20);
  y = 38; doc.setTextColor(44, 26, 6);
  var sorted = DATA.feedings.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  sorted = hiveId ? sorted.filter(function(f){return f.hiveId===hiveId;}) : sorted;
  if (!sorted.length) {
    doc.setFontSize(12); doc.text('No feeding records found.', margin, y);
  }
  sorted.forEach(function(f) {
    if (y > 260) { doc.addPage(); y = 20; }
    var hive = DATA.hives.find(function(h){return h.id===f.hiveId;});
    var ftype = typeof feedTypeDisplay === 'function' ? feedTypeDisplay(f) : (f.feedType||f.feed_type||'');
    var sup = typeof supplementDisplayLine === 'function' ? supplementDisplayLine(f) : (f.supplement||'');
    doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(74, 44, 10);
    doc.text((hive?hive.name:'Unknown') + ' — ' + fmtDate(f.date), margin+3, y);
    y += 6;
    doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(122, 88, 48);
    doc.text('Feed: '+ftype+(f.amount!=null&&f.amount!==''?' · '+f.amount+' '+(f.unit||''):''), margin+3, y); y+=5;
    if (sup) { doc.text('Supplement: '+sup, margin+3, y); y+=5; }
    if (f.notes) { var nl=doc.splitTextToSize('Notes: '+f.notes, pageW-2*margin-6); doc.text(nl, margin+3, y); y+=nl.length*4.5; }
    y += 4;
    doc.setDrawColor(232,160,32); doc.line(margin, y, pageW-margin, y);
    y += 6;
  });
  doc.setTextColor(160,120,80); doc.setFontSize(8);
  doc.text('Apiary HQ — Feeding', margin, 290);
  var hivePart = filterHive ? '_'+filterHive.name.replace(/\s+/g,'_') : '_All_Hives';
  doc.save(apiaryName.replace(/\s+/g,'_')+hivePart+'_Feeding_'+new Date().toISOString().slice(0,10)+'.pdf');
}

function exportFeedingsCSV(hiveId) {
  var apiaryName = document.getElementById('hdr-apiary-name').textContent || 'MyApiary';
  var filterHive = hiveId ? DATA.hives.find(function(h){return h.id===hiveId;}) : null;
  var sorted = DATA.feedings.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  var rows = hiveId ? sorted.filter(function(f){return f.hiveId===hiveId;}) : sorted;
  var headers = ['Date','Hive','Feed Type','Feed Other','Supplement','Supplement Other','Amount','Unit','Notes'];
  var data = [headers].concat(rows.map(function(f){
    var hive = DATA.hives.find(function(h){return h.id===f.hiveId;});
    var ft = f.feedType||f.feed_type||'';
    var fo = f.feedOther||f.feed_other||'';
    var sup = f.supplement||'';
    var so = f.supplementOther||f.supplement_other||'';
    return [f.date, hive?hive.name:'', ft, fo, sup, so, f.amount!=null?f.amount:'', f.unit||'', f.notes||''];
  }));
  var hivePart = filterHive ? '_'+filterHive.name.replace(/\s+/g,'_') : '_All_Hives';
  downloadCSV(apiaryName.replace(/\s+/g,'_')+hivePart+'_Feeding_'+new Date().toISOString().slice(0,10)+'.csv', data);
}

// ═══════════════════════════════════════════════════════
// INSPECTION COMPARISON VIEW
// ═══════════════════════════════════════════════════════
function openInspCompare() {
  if (!DATA.hives.length) { alert('No hives yet.'); return; }
  var hiveOpts = DATA.hives.map(function(h){
    return '<option value="'+h.id+'">'+esc(h.name)+'</option>';
  }).join('');
  var h = '<div class="modal-title">Compare Inspections</div>';
  h += '<div class="fg"><label>Hive</label><select id="cmp-hive" onchange="renderCmpSelectors()"><option value="">— Pick a hive —</option>'+hiveOpts+'</select></div>';
  h += '<div id="cmp-selectors" style="display:none">'+
    '<div class="row2">'+
      '<div class="fg"><label>Inspection A</label><select id="cmp-a"></select></div>'+
      '<div class="fg"><label>Inspection B</label><select id="cmp-b"></select></div>'+
    '</div>'+
    '<button class="btn btn-p" style="margin-top:4px" onclick="runInspCompare()">Compare →</button>'+
  '</div>';
  h += '<div id="cmp-result" style="margin-top:12px"></div>';
  h += '<button class="btn btn-c" onclick="closeModal()">Close</button>';
  openModal(h);
}

function renderCmpSelectors() {
  var hiveId = document.getElementById('cmp-hive').value;
  var wrap = document.getElementById('cmp-selectors');
  if (!hiveId) { wrap.style.display='none'; return; }
  var insps = DATA.inspections
    .filter(function(i){return i.hiveId===hiveId;})
    .sort(function(a,b){return b.date.localeCompare(a.date);});
  if (insps.length < 2) {
    wrap.style.display='none';
    document.getElementById('cmp-result').innerHTML='<div style="font-size:13px;color:var(--txt2);font-style:italic">Need at least 2 inspections for this hive to compare.</div>';
    return;
  }
  var opts = insps.map(function(i){ return '<option value="'+i.id+'">'+fmtDate(i.date)+'</option>'; }).join('');
  document.getElementById('cmp-a').innerHTML = opts;
  document.getElementById('cmp-b').innerHTML = opts;
  // Default B to the second most recent
  document.getElementById('cmp-b').selectedIndex = 1;
  wrap.style.display = '';
  document.getElementById('cmp-result').innerHTML = '';
}

function runInspCompare() {
  var aId = document.getElementById('cmp-a').value;
  var bId = document.getElementById('cmp-b').value;
  if (aId === bId) { document.getElementById('cmp-result').innerHTML='<div style="font-size:13px;color:var(--red)">Please select two different inspections.</div>'; return; }
  var a = DATA.inspections.find(function(i){return i.id===aId;});
  var b = DATA.inspections.find(function(i){return i.id===bId;});
  if (!a||!b) return;

  function starBar(val) {
    val = parseInt(val)||0;
    var filled = '★'.repeat(val);
    var empty = '☆'.repeat(5-val);
    return '<span style="color:var(--amber);font-size:14px">'+filled+'</span><span style="color:var(--border);font-size:14px">'+empty+'</span>';
  }
  function diff(av, bv) {
    var an=parseInt(av)||0, bn=parseInt(bv)||0;
    if (!an||!bn) return '';
    var d=an-bn;
    if (d===0) return '<span style="color:var(--txt2);font-size:11px"> =</span>';
    return d>0
      ? '<span style="color:var(--moss);font-size:11px"> ▲'+d+'</span>'
      : '<span style="color:var(--red);font-size:11px"> ▼'+Math.abs(d)+'</span>';
  }
  function cell(val) { return '<td style="padding:7px 8px;border-bottom:1px solid var(--border);font-size:13px;color:var(--txt)">'+esc(String(val||'—'))+'</td>'; }
  function starCell(val, other) { return '<td style="padding:7px 8px;border-bottom:1px solid var(--border)">'+starBar(val)+diff(val,other)+'</td>'; }
  function hdrCell(val) { return '<th style="padding:7px 8px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--txt2);border-bottom:2px solid var(--amber);white-space:nowrap">'+val+'</th>'; }

  var rows = [
    ['Date',        fmtDate(a.date),                          fmtDate(b.date)],
    ['Queen',       a.queenSeen||a.queen_seen||'—',           b.queenSeen||b.queen_seen||'—'],
    ['Temperament', a.temperament||'—',                       b.temperament||'—'],
    ['Weather',     a.weather||'—',                           b.weather||'—'],
    ['Varroa',      a.varroa||'—',                            b.varroa||'—'],
    ['Fed',         a.feedType||a.feed_type||'—',             b.feedType||b.feed_type||'—'],
    ['Actions',     a.actions||'—',                           b.actions||'—'],
    ['Notes',       a.notes||'—',                             b.notes||'—'],
  ];
  var starRows = [
    ['Population',  a.population, b.population],
    ['Honey Stores',a.honey,      b.honey],
    ['Brood Pattern',a.brood,     b.brood],
  ];

  var tbl = '<div style="overflow-x:auto;margin-top:4px">'+
    '<table style="width:100%;border-collapse:collapse;background:var(--card);border-radius:12px;overflow:hidden">'+
    '<thead><tr>'+
      hdrCell('Metric')+
      hdrCell('Inspection A · '+fmtDate(a.date))+
      hdrCell('Inspection B · '+fmtDate(b.date))+
    '</tr></thead><tbody>';

  // Star rows first
  starRows.forEach(function(r){
    tbl += '<tr><td style="padding:7px 8px;border-bottom:1px solid var(--border);font-size:12px;font-weight:700;color:var(--txt2);white-space:nowrap">'+r[0]+'</td>'+
      starCell(r[1],r[2])+starCell(r[2],r[1])+'</tr>';
  });
  // Text rows
  rows.forEach(function(r){
    tbl += '<tr><td style="padding:7px 8px;border-bottom:1px solid var(--border);font-size:12px;font-weight:700;color:var(--txt2);white-space:nowrap">'+r[0]+'</td>'+cell(r[1])+cell(r[2])+'</tr>';
  });

  tbl += '</tbody></table></div>';
  document.getElementById('cmp-result').innerHTML = tbl;
}
