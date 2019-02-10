# Stream Iterator

<h3>I've made this small util, when I had to parse a lot of text files with specific structure</h3>

<h4>Usage:</h4>

<p> Let's say we have text file with some data, separated via '\r\n' (new line) </p>
<p> For example, let's imagine that we have 5 sections in every line, and we know indexes of start and the end of every section and our task is to excract this data and process it somehow</p>

let's define config with line structure:

```
const config = {
  'Drugid': [0, 11],
  'Packingsize, cleartext': [29, 59],
  'Packingsize numbers': [59, 67],
  'Packingsize, unit': [67, 69],
  'Packing-type': [69, 73]
};
```

then let's imagine we have read stream from this file:

```
const readStream = fs.createReadStream('path_to_file', {encoding: 'utf8'});
```

let's define our StreamIterator:

```
const streamIterator = new StreamIterator(
        {
            stream: readStream, //  stream to iterate
            handler: (info) => { // handler for every line (in our case)
                const obj = {};
                for (const [fieldName, [fromIndex, toIndex]] of Object.entries(config)) {
                    obj[fieldName] = info.slice(fromIndex, toIndex).trim();
                }

                console.log(obj);
            },
            separator: '\r\n', // value to separate data from the stream
        }
    );
```

then let's initialize it

```
    await streamIterator.init()
```

as the result we would have the following output in the console:

```
{ Drugid: '28105036712',
  'Packingsize, cleartext': '56 stk. (blister)',
  'Packingsize numbers': '00005600',
  'Packingsize, unit': 'ST',
  'Packing-type': 'BLI' }
{ Drugid: '28104718910',
  'Packingsize, cleartext': '98 stk. (blister)',
  'Packingsize numbers': '00009800',
  'Packingsize, unit': 'ST',
  'Packing-type': 'BLI' }
{ Drugid: '28104602609',
  'Packingsize, cleartext': '98 stk. (blister)',
  'Packingsize numbers': '00009800',
  'Packingsize, unit': 'ST',
  'Packing-type': 'BLI' }
{ Drugid: '28104884911',
  'Packingsize, cleartext': '15 ml',
  'Packingsize numbers': '00001500',
  'Packingsize, unit': 'ML',
  'Packing-type': 'FLA' }
  ...
```
