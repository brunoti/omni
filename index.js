const fn = {};
const __ = (window.global || window);
__.fn = fn;

/**
 * Pipe function
 *
 * @param {*} initial - Initial value
 * @param {...Function} functions - Pipe functions
 *
 * @returns {*} - The return value of the last function
 *
 * @example
 * pipe(1, i => i + 1) === 2;
 */
const pipe = (initial, ...functions) =>
  functions.reduce((current, f) => f(current), initial);

/**
 * Compose function
 *
 * @param {...Function} functions - functions to run
 *
 * @returns {Function} - a function that call all functions in order
 *
 * @example
 * compose(split('-'), toLower)('FOO-BAR')
 */
const compose = (...functions) => initial =>
  functions.reduceRight((current, f) => f(current), initial);

/**
 * Compose function for promises
 *
 * @param {...function: Promise} functions - functions to run
 *
 * @returns {function: any} - a function that call all functions in order
 *
 * @example
 * compose(Promise.resolve)('FOO-BAR')
 */
compose.promise = (...functions) => async (initial) => {
  let currentValue = initial;

  for (const f of functions.reverse()) {
    currentValue = await f(currentValue); // eslint-disable-line no-await-in-loop
  }

  return currentValue;
};

const curry = function curry(f, size) {
  size = size || f.length;

  return function currify() {
    const args = Array.prototype.slice.call(arguments);
    return args.length >= size ?
      f.apply(null, args) :
      currify.bind(null, ...args)
  }
}

const c = curry;
const ternary = c((test, ifTrue, ifFalse) => value => test(value) ? ifTrue(value) : ifFalse(value));
const anyPass = c((pred, list) => list.some(item => pred(item)));
const allPass = c((pred, list) => list.every(item => pred(item)));
const any = anyPass(Boolean);
const all = allPass(Boolean);
const isError = (value) => value === Error
  || Boolean(value && value.prototype instanceof Error)
  || Boolean(value && value instanceof Error);
const unary = _ => fn => fn(_);
const inject = curry((fn, fn2, value) => {
  fn(fn2(value));
  return fn(value);
});
const identity = _ => _;
const effect = inject(identity);
const tap = prefix => value => effect((value) => console.log(prefix, value), value);
const prop = curry((key, data) => data[key]);
const assoc = curry((key, value, data) => ({
  ...data,
  [key]: value,
}));

/* number */
{
  const nan = value => Number.isNaN(value);
  const add = c((a, b) => a + b);
  const sub = c((a, b) => a - b);
  const is = value => !nan(value) && typeof value === 'number';
  fn.number = Object.freeze({ nan, is, add, sub });
}

/* string */
{
  const replaceAll = curry((from, to, value) => value.replaceAll(from, to));
  const replace = curry((from, to, value) => value.replace(from, to));
  const is = value => typeof value === 'string';
  fn.string = Object.freeze({ replaceAll, replace, is });
}

/* maybe */
{
  const jid = Symbol.for('@@functional/just');
  const just = (value) => ({ [jid]: value });
  const isJust = monad => Object.prototype.hasOwnProperty.call(monad, jid);

  const nid = Symbol.for('@@functional/nothing');
  const nothing = () => ({ [nid]: null });
  const isNothing = monad => Object.prototype.hasOwnProperty.call(monad, nid);

  const is = monad => isNothing(monad) || isJust(monad);

  const of = (value, valid = v => v === null || v === undefined) => (valid(value) ? nothing() : just(value));
  of.number = value => of(value, fn.number.is);
  of.string = value => of(value, fn.string.is);

  const fold = monad => isJust(monad) ? monad[jid] : monad[nid];

  const map = curry((mapper, monad) => ternary(
    isJust,
    compose(of, mapper, fold),
    identity,
  )(monad));

  const bind = curry((mapper, monad) => ternary(
    isJust,
    compose(
      ternary(is, identity, of),
      mapper,
      fold,
    ),
    identity,
  )(monad));

  fn.maybe = Object.freeze({
    is,
    of,
    fold,
    map,
    bind,
    just,
    nothing,
    isJust,
    isNothing,
  });
}

{
  const head = list => list[0];
  const last = list => head(list.slice(-1));
  const map = curry((mapper, list) => list.map(item => mapper(item)));
  const find = curry((pred, list) => fn.maybe.of(list.find(item => pred(item))));
  const filter = curry((pred, list) => fn.maybe.of(list.filter(item => pred(item))));

  fn.list = Object.freeze({
    last,
    filter,
    map,
    find,
  });
}

{
  const all = curry((selector, element) => compose(
    Array.from,
    element.querySelectorAll.bind(element)
  )(selector));
  const last = curry((selector, element) => pipe(all(selector, element), fn.list.last, fn.maybe.of));
  const one = curry((selector, element) => pipe(element.querySelector(selector), fn.maybe.of));
  const closest = curry((selector, element) => element.closest(selector));
  const findByText = curry((query, text) => pipe(
    all(query, document),
    fn.list.find(elements => elements.innerText.toLowerCase().includes(text.toLowerCase())),
  ));

  const after = (ref, what) => ref.parentNode.insertBefore(what, ref.nextSibling);

  fn.dom = Object.freeze({
    last,
    one,
    all,
    closest,
    findByText,
  });
}

/* either */
{
  const lid = Symbol.for('@@functional/left');
  const left = (value) => ({ [lid]: value });
  const isLeft = monad => Object.prototype.hasOwnProperty.call(monad, lid);

  const rid = Symbol.for('@@functional/right');
  const right = (value) => ({ [rid]: value });
  const isRight = monad => Object.prototype.hasOwnProperty.call(monad, rid);

  const is = monad => isLeft(monad) || isRight(monad);

  const of = value => {
    try {
      const result = value();
      return right(result);
    } catch (error) {
      return left(error);
    }
  };

  const fold = monad => isRight(monad) ? monad[rid] : monad[lid];
  const bifold = monad => isRight(monad) ? monad[rid] : monad[lid];
  const bimap = curry((mapLeft, mapRight, monad) => isRight(monad) ? right(mapRight(monad[rid])) : left(mapLeft(monad[lid])));
  const bifoldMap = curry((mapLeft, mapRight, monad) => isRight(monad) ? mapRight(monad[rid]) : mapLeft(monad[lid]));

  const map = curry((mapper, monad) => ternary(
    isRight,
    compose(right, mapper, fold),
    identity,
  )(monad));

  const bind = curry((mapper, monad) => ternary(
    isRight,
    compose(
      ternary(is, identity, right),
      mapper,
      fold,
    ),
    identity,
  )(monad));

  fn.either = Object.freeze({
    is,
    of,
    fold,
    bifold,
    bifoldMap,
    bimap,
    map,
    bind,
    left,
    right,
    isLeft,
    isRight,
  });
}

/* io */
{
  const runid = Symbol.for('@@functional/io/run');
  const of = fn => ({ [runid]: () => fn() });
  const fold = monad => monad[runid];
  const isIo = monad => Object.prototype.hasOwnProperty.call(monad, runid);
  const map = curry((fn, monad) => of(() => fn(run(monad))));
  const bind = curry((fn, monad) => of(() => run(fn(run(monad)))));
  const run = monad => fold(monad)();

  fn.io = Object.freeze({
    of,
    fold,
    isIo,
    map,
    bind,
    run,
  });
}

/* task */
{
  const is = monad => isLeft(monad) || isRight(monad);

  const of = async value => {
    try {
      const result = await value();
      return fn.either.right(result);
    } catch (error) {
      return fn.either.left(error);
    }
  };

  const fold = monad => isRight(monad) ? monad[rid] : monad[lid];
  const bifold = monad => isRight(monad) ? monad[rid] : monad[lid];
  const bimap = curry((mapLeft, mapRight, monad) => isRight(monad) ? right(mapRight(monad[rid])) : left(mapLeft(monad[lid])));
  const bifoldMap = curry((mapLeft, mapRight, monad) => isRight(monad) ? mapRight(monad[rid]) : mapLeft(monad[lid]));

  const map = curry((mapper, monad) => ternary(
    isRight,
    compose(right, mapper, fold),
    identity,
  )(monad));

  const bind = curry((mapper, monad) => ternary(
    isRight,
    compose(
      ternary(is, identity, right),
      mapper,
      fold,
    ),
    identity,
  )(monad));

  fn.task = Object.freeze({ });
}

fn.tap = tap;
fn.effect = effect;
fn.unary = unary;
fn.ternary = ternary;
fn.identity = identity;
fn.pipe = pipe;
fn.compose = compose;
fn.curry = curry;
