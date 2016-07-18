var Bluebird = require("bluebird")
var Deferred = require("..")
var defer = Deferred

describe("defer", function() {
  it("must return an instance of Deferred", function() {
    defer().must.be.an.instanceof(Deferred)
  })

  describe("resolve", function() {
    it("must resolve the promise", function() {
      var deferred = defer()
      deferred.resolve(42)
      return deferred.promise.then(function(value) { value.must.equal(42) })
    })

    it("must resolve the promise given a Promise constructor", function() {
      var deferred = defer(Bluebird)
      deferred.resolve(42)
      return deferred.promise.then(function(value) { value.must.equal(42) })
    })
  })

  describe("reject", function() {
    it("must reject the promise", function(done) {
      var deferred = defer()
      deferred.reject(42)
      deferred.promise.catch(function(value) { value.must.equal(42); done() })
    })

    it("must reject the promise given a Promise constructor", function(done) {
      var deferred = defer(Bluebird)
      deferred.reject(42)
      deferred.promise.catch(function(value) { value.must.equal(42); done() })
    })
  })

  describe("promise", function() {
    it("must be an instance of Promise", function() {
      defer().promise.must.be.an.instanceof(Promise)
    })

    it("must be an instance of the given Promise constructor", function() {
      defer(Bluebird).promise.must.be.an.instanceof(Bluebird)
    })
  })
})
