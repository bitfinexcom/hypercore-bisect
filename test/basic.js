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
