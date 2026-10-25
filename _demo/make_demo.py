"""בונה עמוד דמו מקומי מתוך dashboard.html האמיתי, עם גשר IPC מדומה.

לא נשלח לריפו ולא לאתר — משמש רק להקלטת סרטוני ההדרכה.
"""
from pathlib import Path
import re, shutil

ROOT = Path(__file__).resolve().parents[2]      # landing/_demo -> landing -> project
SRC = ROOT / "re" / "dashboard.html"
OUT_DIR = Path(__file__).resolve().parent
OUT = OUT_DIR / "dashboard.html"

html = SRC.read_text(encoding="utf-8")

# הזרקת הגשר *לפני* הסקריפט הראשי, כדי ש-window.electronAPI יהיה קיים בטעינה.
bridge = r"""
<script>
/* ── גשר מדומה להקלטת הדרכה ────────────────────────────────────────────── */
(function () {
  const now = Math.floor(Date.now() / 1000);

  const peers = {
    trusted: [
      { device_id: '7f3a91c2d4e5b608', alias: 'LAPTOP-BLUE', address: '192.168.137.12', port: 47023, os: 'Windows 11', online: true, last_seen: now - 2 },
      { device_id: 'c14d77aa10bb23ef', alias: 'DESK-02', address: '192.168.137.24', port: 47023, os: 'Windows 10', online: true, last_seen: now - 5 },
      { device_id: '55ee19ac77f0b213', alias: 'LAPTOP-GREEN', address: '192.168.137.31', port: 47023, os: 'Windows 11', online: true, last_seen: now - 9 }
    ],
    pending: [],
    blocked: []
  };

  const files = [
    { filename: 'דף מקורות — בבא קמא.pdf', size: 2457600, file_hash: 'a1b2c3d4e5f60718', timestamp: now - 400, owner_id: 'self' },
    { filename: 'שיעור כללי — הרב.mp3', size: 50331648, file_hash: 'b2c3d4e5f6071829', timestamp: now - 900, owner_id: '7f3a91c2d4e5b608' },
    { filename: 'חברותא — סיכום שבועי.docx', size: 184320, file_hash: 'c3d4e5f607182930', timestamp: now - 4000, owner_id: 'c14d77aa10bb23ef' },
    { filename: 'סריקת דפים — כתובות.docx', size: 1887436, file_hash: 'd4e5f60718293041', timestamp: now - 8600, owner_id: 'self' }
  ];

  const groups = [
    { group_id: 'g1', group_name: 'חברותא — סדר ב׳', role: 'admin', members: 5 },
    { group_id: 'g2', group_name: 'שיעור כללי', role: 'member', members: 12 }
  ];

  const groupDetails = {
    g1: {
      group: groups[0],
      members: [
        { device_id: '8969070181b1a5f1', alias: 'LAPTOP-RED', role: 'admin' },
        { device_id: '7f3a91c2d4e5b608', alias: 'LAPTOP-BLUE', role: 'co-admin' },
        { device_id: 'c14d77aa10bb23ef', alias: 'DESK-02', role: 'member' },
        { device_id: '55ee19ac77f0b213', alias: 'LAPTOP-GREEN', role: 'member' },
        { device_id: '9ab30c4d5e6f7788', alias: 'DESK-07', role: 'member' }
      ],
      files: [
        { filename: 'בבא קמא — דף מקורות.pdf', size: 1258291, file_hash: 'e5f6071829304152', timestamp: now - 700, owner_id: '7f3a91c2d4e5b608' },
        { filename: 'סיכום סוגיות — שבוע 3.docx', size: 96256, file_hash: 'f607182930415263', timestamp: now - 3200, owner_id: '8969070181b1a5f1' }
      ]
    },
    g2: { group: groups[1], members: [], files: [] }
  };

  const diagReport = {
    findings: [
      { severity: 'ok',   code: 'firewall_ok',        params: {} },
      { severity: 'ok',   code: 'peers_online',       params: { count: 3, names: 'LAPTOP-BLUE, DESK-02, LAPTOP-GREEN' } },
      { severity: 'info', code: 'no_default_gateway', params: {} }
    ],
    facts: { interfaces: ['Wi-Fi', 'Ethernet'], other_hosts: 4, beacons_sent: 6, beacons_received: 3 }
  };

  const replies = {
    device_info: { device_id: '8969070181b1a5f1', friendly: 'LAPTOP-RED', os: 'Windows 11', version: '1.2.3' },
    list_peers: peers,
    list_discovered_peers: { peers: [] },
    list_files: { files: files, max_incoming_mb: null },
    list_groups: { groups: groups },
    get_group_details: groupDetails.g1,
    get_group_messages: { messages: [] },
    get_group_files: { files: groupDetails.g1.files },
    get_pending_invites: { invites: [] },
    get_system_messages: { messages: [] },
    count_unseen_system_messages: { count: 0 },
    count_unseen_feedback: { count: 0 },
    get_admin_mode: { is_admin: false },
    get_firewall_status: { supported: true, query_ok: true, all_covered: true, profiles: ['Private', 'Domain'], tcp: { ports: [47023, 47024] } },
    get_storage_settings: { max_incoming_mb: null, used_mb: 52, files_count: 4 },
    get_relay_settings: { enabled: false, target: '', configured: false, is_default: false, status: 'off' },
    get_bluetooth_settings: { enabled: false, available: true, connected: 0 },
    get_update_status: { update_available: false },
    get_known_users: { users: [] },
    list_admins: { admins: [] },
    get_update_history: { updates: [] },
    get_cloud_mailbox_settings: { url: '' },
    get_autostart: { enabled: false },
    list_comments: { comments: [] },
    get_comments: { comments: [] },
    run_network_diagnostics: diagReport,
    get_relay_test: {},
    set_alias: { alias: 'LAPTOP-RED' },
    accept_invite: {}, reject_invite: {}, approve_peer: {}, remove_peer: {}, block_peer: {}, unblock_peer: {},
    create_group: {}, delete_group: {}, invite_to_group: {},
    mark_system_messages_seen: {}, mark_updates_seen: {}, mark_feedback_seen: {},
    chat_send: {}, group_chat_send: {}, chat_send_reaction: {},
    send_file_to_peer: {}, install_firewall_rules: { status: 'started' }
  };

  // ── אירועים מהבקאנד: אוגרים את המטפלים כדי שתסריט ההדגמה יוכל לירות אותם ──
  const handlers = {};
  window.__demoHandlers = handlers;
  window.__demoMock = { replies: replies, files: files, peers: peers, groups: groups, groupDetails: groupDetails };

  window.electronAPI = {
    invoke: function (command) {
      return Promise.resolve(replies[command] || {}).then(function (v) { return v; });
    },
    onEvent: function (name, cb) {
      (handlers[name] = handlers[name] || []).push(cb);
      return function () {};
    },
    openFolder: function () {}, openExternal: function () {},
    openFile: function () { return Promise.resolve({ success: true }); },
    showOpenDialog: function () { return Promise.resolve({ filePaths: [] }); },
    copyToSync: function () { return Promise.resolve({ results: [] }); },
    showNotification: function () {},
    getAutoStart: function () { return Promise.resolve({ enabled: false }); },
    setAutoStart: function () { return Promise.resolve({ success: true }); },
    minimize: function () {}, maximize: function () {}, close: function () {},
    splashDone: function () {}
  };

  // ── כלי עזר לתסריטים (מים, הודעות, קבצים) ─────────────────────────────────
  window.__demo = {
    emit: function (name, data) {
      (handlers[name] || []).forEach(function (fn) { try { fn(data); } catch (e) { console.error(e); } });
    },
    addFile: function (filename, size, ownerId) {
      files.unshift({ filename: filename, size: size, file_hash: 'h' + Math.random().toString(16).slice(2, 10), timestamp: Math.floor(Date.now() / 1000), owner_id: ownerId || '7f3a91c2d4e5b608' });
      if (typeof loadFilesWithGroups === 'function') loadFilesWithGroups();
    },
    setPeersOnline: function (on) {
      peers.trusted.forEach(function (p) { p.online = !!on; p.last_seen = Math.floor(Date.now() / 1000); });
      if (typeof loadPeers === 'function') loadPeers();
    },
    setPending: function (list) {
      peers.pending = list;
      if (typeof loadPeers === 'function') loadPeers();
    },
    setDiagnostics: function (report) { replies.run_network_diagnostics = report; },
    openGroup: function (id) {
      replies.get_group_details = groupDetails[id];
      if (typeof openGroupDetail === 'function') openGroupDetail(id);
    },
    groupChatIncoming: function (groupId, alias, text) {
      window.__demo.emit('group_chat_message', { group_id: groupId, from_alias: alias, text: text, from: '7f3a91c2d4e5b608' });
    }
  };

  try { localStorage.setItem('p2p_setup_done', '1'); } catch (e) {}
})();
</script>
"""

marker = "<script>\n// ── שפה (i18n)"
if marker not in html:
    # גיבוי: לפני הסקריפט האחרון בקובץ
    idx = html.rfind("<script>")
    html = html[:idx] + bridge + html[idx:]
else:
    html = html.replace(marker, bridge + marker, 1)

# שכבת ההצגה (סמן, כיתוביות) נטענת אחרי הסקריפט הראשי
if 'presenter.js' not in html:
    html = html.replace('</body>', '<script src="presenter.js"></script>\n<script src="hooks.js"></script>\n</body>', 1)

# הלוגו צריך להימצא לצד העמוד
for name in ("logo.png", "icon.png"):
    src = ROOT / "re" / name
    if src.exists():
        shutil.copyfile(src, OUT_DIR / name)

OUT.write_text(html, encoding="utf-8")
print("wrote", OUT, len(html))
