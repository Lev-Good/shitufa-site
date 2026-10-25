/* hooks.js — התאמות התנהגות לדמו בלבד (לא חלק מהתוכנה).
   הפונקציות האמיתיות קוראות לבקאנד; כאן הן מעדכנות את הנתונים המדומים
   ואת התצוגה, כדי שההקלטה תראה תוצאה אמיתית של הפעולה. */
window.addEventListener('load', function () {
  var M = window.__demoMock;

  window.approvePeer = function (id) {
    var p = (M.peers.pending || []).filter(function (x) { return x.device_id === id; })[0];
    if (p) {
      M.peers.pending = M.peers.pending.filter(function (x) { return x.device_id !== id; });
      M.peers.trusted.push({ device_id: p.device_id, alias: p.alias, address: p.address, port: 47023, os: 'Windows 11', online: true, last_seen: Math.floor(Date.now() / 1000) });
    }
    if (typeof toast === 'function') toast('המחשב אושר — מעכשיו הקבצים מסתנכרנים', 'success');
    if (typeof loadPeers === 'function') loadPeers();
  };

  window.blockPeer = function (id) {
    var p = (M.peers.trusted || []).filter(function (x) { return x.device_id === id; })[0];
    if (p) {
      M.peers.trusted = M.peers.trusted.filter(function (x) { return x.device_id !== id; });
      M.peers.blocked.push({ device_id: p.device_id, alias: p.alias });
    }
    if (typeof toast === 'function') toast('העמית נחסם — לא יוכל לשלוח לך קבצים', 'success');
    if (typeof loadPeers === 'function') loadPeers();
  };

  window.unblockPeer = function (id) {
    var p = (M.peers.blocked || []).filter(function (x) { return x.device_id === id; })[0];
    if (p) {
      M.peers.blocked = M.peers.blocked.filter(function (x) { return x.device_id !== id; });
      M.peers.pending.push(p);
    }
    if (typeof toast === 'function') toast('החסימה הוסרה', 'success');
    if (typeof loadPeers === 'function') loadPeers();
  };

  // מכסת האחסון: הבקאנד המדומה זוכר את הערך, כדי שהמסך יראה את התוצאה
  window.saveStorageLimit = function () {
    var enabled = document.getElementById('quota-enabled').checked;
    var raw = document.getElementById('quota-mb').value;
    var maxMb = enabled ? parseInt(raw, 10) : null;
    if (enabled && (!maxMb || maxMb < 1)) { toast('הזן ערך תקין במגה-בייט', 'warn'); return; }
    M.replies.get_storage_settings.max_incoming_mb = maxMb;
    toast(maxMb ? 'המכסה נקבעה ל-' + maxMb + ' MB' : 'ההגבלה בוטלה', 'success');
    if (typeof loadStorageSettings === 'function') loadStorageSettings();
  };

  window.createNewGroup = function () {
    var input = document.getElementById('new-group-name');
    var name = (input.value || '').trim();
    if (!name) { toast('הזן שם לקבוצה', 'warn'); return; }
    M.groups.push({ group_id: 'g' + (M.groups.length + 1), group_name: name, role: 'admin', members: 1 });
    if (typeof toast === 'function') toast('קבוצה "' + name + '" נוצרה — אתה המנהל שלה', 'success');
    if (typeof closeCreateGroupModal === 'function') closeCreateGroupModal();
    input.value = '';
    if (typeof loadGroups === 'function') loadGroups();
  };
});
