// практична 8 - функції вищого порядку
// варіант 1: бібліотека для трансформації даних

// власний map (без Array.prototype.map)
function myMap(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i], i));
  }
  return result;
}

// власний filter
function myFilter(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i])) result.push(arr[i]);
  }
  return result;
}

// власний reduce
function myReduce(arr, fn, initial) {
  let acc = initial !== undefined ? initial : arr[0];
  const startIdx = initial !== undefined ? 0 : 1;
  for (let i = startIdx; i < arr.length; i++) {
    acc = fn(acc, arr[i]);
  }
  return acc;
}

// compose - виконує функції справа наліво: compose(f, g)(x) === f(g(x))
function compose(...fns) {
  return x => fns.reduceRight((acc, fn) => fn(acc), x);
}

// pipe - виконує функції зліва направо
function pipe(...fns) {
  return x => fns.reduce((acc, fn) => fn(acc), x);
}

// curry - дозволяє викликати функцію частинами
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return function(...nextArgs) {
      return curried(...args, ...nextArgs);
    };
  };
}

// partial - фіксує перші аргументи
function partial(fn, ...preArgs) {
  return function(...restArgs) {
    return fn(...preArgs, ...restArgs);
  };
}

// memoize - кешує результати щоб не рахувати двічі
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    cache[key] = fn(...args);
    return cache[key];
  };
}

// chainable API
function chain(data) {
  return {
    map(fn)          { return chain(myMap(data, fn)); },
    filter(fn)       { return chain(myFilter(data, fn)); },
    reduce(fn, init) { return myReduce(data, fn, init); },
    value()          { return data; }
  };
}


// ---- приклади ----

// map
console.log('myMap:', myMap([1, 2, 3], x => x * 2));
// [2, 4, 6]

// filter
console.log('myFilter:', myFilter([1, 2, 3, 4, 5], x => x % 2 === 0));
// [2, 4]

// reduce
console.log('myReduce:', myReduce([1, 2, 3, 4], (acc, x) => acc + x, 0));
// 10

// compose і pipe
const double  = x => x * 2;
const addOne  = x => x + 1;
const square  = x => x * x;

const withCompose = compose(square, addOne, double);
console.log('compose(square, addOne, double)(3):', withCompose(3)); // (3*2+1)^2 = 49

const withPipe = pipe(double, addOne, square);
console.log('pipe(double, addOne, square)(3):', withPipe(3)); // (3*2+1)^2 = 49

// curry
const add = curry((a, b) => a + b);
const add10 = add(10);
console.log('curry add10(5):', add10(5));   // 15
console.log('curry add10(20):', add10(20)); // 30

// partial
const multiply = (a, b, c) => a * b * c;
const triple = partial(multiply, 3);
console.log('partial triple(2, 4):', triple(2, 4)); // 24

// memoize
const heavyCalc = memoize(n => {
  console.log(`  рахую для ${n}...`);
  return n * n;
});
console.log('memoize:', heavyCalc(5)); // рахує
console.log('memoize:', heavyCalc(5)); // з кешу
console.log('memoize:', heavyCalc(3)); // рахує

// chain
const chainResult = chain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .filter(x => x % 2 === 0)
  .map(x => x * x)
  .reduce((acc, x) => acc + x, 0);
console.log('chain result:', chainResult); // 4+16+36+64+100 = 220
