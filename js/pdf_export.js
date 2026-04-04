
// ═══════════════════════════════════════════════════════
// PDF EXPORT
// ═══════════════════════════════════════════════════════
function exportInspectionsPDF() {
  if (typeof window.jspdf === 'undefined' && typeof jspdf === 'undefined') {
    alert('PDF library loading, please try again in a moment.'); return;
  }
  var {jsPDF} = window.jspdf || jspdf;
  var doc = new jsPDF({unit:'mm',format:'a4'});
  var apiaryName = document.getElementById('hdr-apiary-name').textContent || 'My Apiary';
  var pageW = doc.internal.pageSize.getWidth();
  var margin = 15; var y = 20;
  // Header
  doc.setFillColor(74, 44, 10);
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setTextColor(245, 223, 160);
  doc.setFontSize(18); doc.setFont('helvetica','bold');
  doc.text(apiaryName + ' — Inspection Report', margin, 12);
  doc.setFontSize(10); doc.setFont('helvetica','normal');
  doc.text('Generated: ' + new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), margin, 20);
  y = 38; doc.setTextColor(44, 26, 6);
  var sorted = DATA.inspections.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
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
    doc.text('Population: '+i.population+'/5  Honey Stores: '+i.honey+'/5  Brood Pattern: '+i.brood+'/5', margin+3, y);
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
  doc.save(apiaryName.replace(/\s+/g,'_')+'_Inspections_'+new Date().toISOString().slice(0,10)+'.pdf');
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
  doc.setFillColor(74, 44, 10); doc.rect(0, 0, pageW, 28, 'F');
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
