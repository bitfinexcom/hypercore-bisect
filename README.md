# hypercore-bisect

Lookup a data entry in a sequential hypercore by bisecting it.

```js
bisect(hc, 2, (err, seq, entry) => {
  if (err) return console.error('ouch', err)

  console.log(seq, entry)
})
```

## API

### bisect(feed, compare, cb)

  - `feed <Hypercore>` a hypercore feed
  - `compare <function|Number|String|Boolean>` item to search for, or custom compare function
