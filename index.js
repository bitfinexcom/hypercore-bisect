'use strict'

function toCompare (needle) {
  const isBuf = Buffer.isBuffer(needle)

  return function _compare (res, cb) {
    if ((isBuf && res.equals(needle)) || (!isBuf && res === needle)) {
      return cb(null, 0)
    }

    if (res < needle) return cb(null, -1)

    return cb(null, needle)
  }
}

function bisect (feed, compare, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

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
          if (opts.returnClosest) {
            return cb(null, middle, data)
          }

          return cb(null, -1, null)
        }

        _bisect()
      })
    })
  }

  _bisect()
}

module.exports = bisect
