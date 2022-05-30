// https://github.com/angus-c/just/blob/master/packages/object-merge/index.js commit f4e403a
/* eslint-disable */
export function merge(/* obj1, obj2, [objn] */) {
  var args = [].slice.call(arguments);
  var arg;
  var i = args.length;
  while (((arg = args[i - 1]), i--)) {
    if (!arg || (typeof arg != 'object' && typeof arg != 'function')) {
      throw new Error('expected object, got ' + arg);
    }
  }
  var result = args[0];
  var extenders = args.slice(1);
  var len = extenders.length;
  for (var i = 0; i < len; i++) {
    var extender = extenders[i];
    for (var key in extender) {
      result[key] = extender[key];
    }
  }
  return result;
}