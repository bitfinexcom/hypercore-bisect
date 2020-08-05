'use strict'

const test = require('tape')
const hypercore = require('hypercore')
const ram = require('random-access-memory')

const bisect = require('../')

test('finds an entry with convenience method', (t) => {
  t.plan(3)

  const hc = hypercore(ram, { valueEncoding: 'json' })
  hc.append([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], () => {
    bisect(hc, 2, (err, seq, entry) => {
      t.notOk(err)
      t.same(seq, 1)
      t.same(entry, 2)
    })
  })
})

test('return -1 if no result found', (t) => {
  t.plan(3)

  const hc = hypercore(ram, { valueEncoding: 'json' })
  hc.append([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], () => {
    bisect(hc, 11, (err, seq, entry) => {
      t.notOk(err)
      t.same(seq, -1)
      t.same(entry, null)
    })
  })
})

test('return closest entry if returnClosest enabled', (t) => {
  t.plan(3)

  const hc = hypercore(ram, { valueEncoding: 'json' })
  hc.append([1, 2, 3, 4, 6, 7, 8, 9, 10], () => {
    bisect(hc, 5, { returnClosest: true }, (err, seq, entry) => {
      t.notOk(err)
      t.same(seq, 3)
      t.same(entry, 4)
    })
  })
})

test('return closest entry if returnClosest enabled - out of bounds', (t) => {
  t.plan(3)

  const hc = hypercore(ram, { valueEncoding: 'json' })
  hc.append([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], () => {
    bisect(hc, 11, { returnClosest: true }, (err, seq, entry) => {
      t.notOk(err)
      t.same(seq, 9)
      t.same(entry, 10)
    })
  })
})

test('takes compare functions to find values', (t) => {
  t.plan(3)

  const hc = hypercore(ram, { valueEncoding: 'json' })
  const compare = (res, cb) => {
    return cb(null, 0)
  }

  hc.append([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], () => {
    bisect(hc, compare, (err, seq, entry) => {
      t.notOk(err)
      t.same(seq, 5)
      t.same(entry, 6)
    })
  })
})

test('finds entries that are buffers', (t) => {
  t.plan(3)

  const entries = []
  for (let i = 1; i < 11; i++) {
    entries.push(Buffer.from(i + ''))
  }

  const hc = hypercore(ram, { valueEncoding: 'binary' })
  hc.append(entries, () => {
    bisect(hc, Buffer.from('2'), (err, seq, entry) => {
      t.notOk(err)
      t.same(seq, 1)
      t.same(entry, Buffer.from('2'))
    })
  })
})
