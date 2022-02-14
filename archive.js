const { dom, curry, list, maybe } = window.fn;

const gid = Symbol.for('@functions/go');

const go = (data) => ({
  [gid]: data,
  run(fn) {
    return go(fn(this[gid]));
  },
  fold() {
    return this[gid];
  },
});

const games = () => go(dom.all('td > a', document))
  .run(list.map(a => ({
    name: a.textContent.trim(),
    link: a.href,
    searchable: a.textContent.trim().toLowerCase(),
  })))
  .run(v => v.filter(({ searchable }) => searchable.includes('usa')));

games.find = (what) => games().run(list.find(
  ({ searchable }) => searchable.includes(what),
));

games.download = (what) => games.find(what).run(value => maybe.isJust(value) ? location.href(value) : maybe.nothing());
games.get = () => games().fold();

window.fn.games = games;
