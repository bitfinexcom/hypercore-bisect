# hypercore-bisect

Lookup a data entry in a sequential hypercore by bisecting it.

**Example:**

```js
const hc = hypercore(ram, { valueEncoding: 'json' })

hc.append([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], () => {
  bisect(hc, 2, (err, seq, entry) => {
    if (err) return console.error('ouch', err)

    console.log(seq, entry) // 1, 2
  })
})
```

Get the closest entry if nothing was found, useful for timeframes:

```js
  const hc = hypercore(ram, { valueEncoding: 'json' })

  hc.append([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], () => {
    bisect(hc, 11, { returnClosest: true }, (err, seq, entry) => {
      if (err) return console.error('ouch', err)

      console.log(seq, entry) // 9, 10
    })
  })
```

## API

### bisect(feed, compare, [opts], cb)

  - `feed <Hypercore>` a hypercore feed
  - `compare <function|Number|String|Boolean|Buffer>` item to search for, or custom compare function
  - `opts <Object> (optional)`
    - `returnClosest` if nothing is found, return closest match
