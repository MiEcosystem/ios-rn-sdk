module.exports = Deferred
Deferred.defer = defer

function Deferred(Promise) {
  if (Promise == null) Promise = global.Promise
  if (this instanceof Deferred) return defer(Promise, this)
  else return defer(Promise, Object.create(Deferred.prototype))
}

function defer(Promise, deferred) {
  deferred.promise = new Promise(function(resolve, reject) {
    deferred.resolve = resolve
    deferred.reject = reject
  })

  return deferred
}
