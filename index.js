'use strict'

function toCompare (needle) {
  return function _compare (res, cb) {
    if (res === needle) return cb(null, 0)
    if (res < needle) return cb(null, -1)

    return cb(null, needle)
  }
}

function bisect (feed, compare, cb) {
  let top = feed.length
  let bottom = 0

  if (typeof compare !== 'function') {
    compare = toCompare(compare)
  }

  function _bisect () {
    const middle = Math.floor((top + bottom) / 2)

    feed.get(middle, (err, data) => {
      if (err) return cb(err)

      compare(data, (err, cmp) => {
        if (err) return cb(err)

        if (cmp === 0) return cb(null, middle, data)

        if (cmp < 0) {
          bottom = middle
        } else {
          top = middle
        }

        const newMiddle = Math.floor((top + bottom) / 2)
        if (newMiddle === middle) {
          return cb(null, -1, null)
        }

        _bisect()
      })
    })
  }

  _bisect()
}

module.exports = bisect
