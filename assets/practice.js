/* Accountancy: journal entry practice. Questions are in the page (window.ACQ); the score lives only in this tab. */
(function () {
  'use strict';
  var d = document, box = d.getElementById('pq');
  if (!box || !window.ACQ) return;
  var Q = window.ACQ.slice(), $ = function (id) { return d.getElementById(id); };
  var all = [], i, order, pos = 0, right = 0, done = 0, pickDr = null, pickCr = null, answered = false;
  Q.forEach(function (q) { [q[1], q[2]].forEach(function (a) { if (all.indexOf(a) < 0) all.push(a); }); });
  function shuffle(a) { for (var j = a.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)), t = a[j]; a[j] = a[k]; a[k] = t; } return a; }
  order = shuffle(Q.map(function (_, n) { return n; }));
  function options(q) {
    var set = [q[1], q[2]];
    var pool = shuffle(all.filter(function (a) { return set.indexOf(a) < 0; }));
    while (set.length < 5) set.push(pool.pop());
    return shuffle(set);
  }
  function btns(side, opts) {
    return opts.map(function (o) { return '<button type="button" data-side="' + side + '" data-v="' + SYG.esc(o) + '" aria-pressed="false">' + SYG.esc(o) + '</button>'; }).join('');
  }
  function show() {
    var q = Q[order[pos]], opts = options(q);
    pickDr = pickCr = null; answered = false;
    $('pq-n').textContent = 'Question ' + (pos + 1) + ' of ' + Q.length;
    $('pq-t').textContent = q[0];
    $('pq-dr').innerHTML = btns('dr', opts); $('pq-cr').innerHTML = btns('cr', opts);
    $('pq-res').hidden = true; $('pq-check').hidden = false; $('pq-next').hidden = true;
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-side]');
    if (!b || answered) return;
    var side = b.getAttribute('data-side');
    Array.prototype.forEach.call(box.querySelectorAll('button[data-side=' + side + ']'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    if (side === 'dr') pickDr = b.getAttribute('data-v'); else pickCr = b.getAttribute('data-v');
  });
  $('pq-check').addEventListener('click', function () {
    if (!pickDr || !pickCr) { SYG.toast('Choose one account to debit and one to credit'); return; }
    var q = Q[order[pos]], ok = pickDr === q[1] && pickCr === q[2];
    answered = true; done++; if (ok) right++;
    Array.prototype.forEach.call(box.querySelectorAll('button[data-side]'), function (x) {
      var good = x.getAttribute('data-v') === (x.getAttribute('data-side') === 'dr' ? q[1] : q[2]);
      if (good) x.classList.add('good'); else if (x.getAttribute('aria-pressed') === 'true') x.classList.add('bad');
      x.disabled = true;
    });
    $('pq-res').hidden = false;
    $('pq-res').className = 'result ' + (ok ? 'ok' : 'no');
    $('pq-res').innerHTML = '<h2>' + (ok ? 'Correct' : 'Not quite') + '</h2><p class="mono">' + SYG.esc(q[1]) + ' &nbsp; Dr.<br>&nbsp;&nbsp;&nbsp;To ' + SYG.esc(q[2]) + '</p><p>' + SYG.esc(q[3]) + '</p>';
    $('pq-score').textContent = 'Score: ' + right + ' of ' + done;
    $('pq-check').hidden = true; $('pq-next').hidden = false;
    $('pq-next').textContent = pos + 1 < Q.length ? 'Next question' : 'Start again';
    $('pq-next').focus();
  });
  $('pq-next').addEventListener('click', function () {
    pos++;
    if (pos >= Q.length) { SYG.toast('Round finished: ' + right + ' of ' + done + ' correct'); pos = 0; right = done = 0; order = shuffle(order); $('pq-score').textContent = 'Score: 0 of 0'; }
    show();
  });
  show();
})();
/* glossary filter */
(function () {
  var q = document.getElementById('gl-q');
  if (!q) return;
  var items = document.querySelectorAll('#gl-list > div'), none = document.getElementById('gl-none');
  q.addEventListener('input', function () {
    var v = q.value.trim().toLowerCase(), n = 0;
    Array.prototype.forEach.call(items, function (el) { var hit = !v || el.textContent.toLowerCase().indexOf(v) > -1; el.hidden = !hit; if (hit) n++; });
    none.hidden = n > 0;
  });
})();
