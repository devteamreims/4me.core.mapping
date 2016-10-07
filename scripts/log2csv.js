import fs from 'fs';
import moment from 'moment';
import path from 'path';
import R from 'ramda';

const files = ['august-mapping.json', 'september-mapping.json', 'october-mapping.json'];

const getFile = file => path.join(__dirname, '..', 'logs', file);

const processItem = (item) => {
  const log = R.pipe(
    R.prop('log'),
    R.head,
    JSON.parse,
  )(item);

  const map = R.prop('map', log);

  const when = R.prop('time', log);

  return {map, when};
}

const prepareCsv = ({map, when}) => {
  const date = moment.utc(when).format('YYYY.MM.DD');
  const time = moment.utc(when).format('HH:mm:ss');

  const sectors = R.map(
    R.pipe(
      R.prop('sectors'),
      R.join(' '),
    ),
  )(map);

  return [`${date} ${time}`, R.length(sectors), ...sectors];
}

const toCsv = R.join(',');

const processFile = R.pipe(
  getFile,
  fs.readFileSync,
  JSON.parse,
  R.path(['hits', 'hits']),
  R.map(
    R.pipe(
      R.prop('fields'),
      processItem,
      prepareCsv,
    )
  ),
  R.sortBy(R.head),
  R.map(toCsv),
  R.map(R.tap(console.log)),
);


R.map(processFile, files);

