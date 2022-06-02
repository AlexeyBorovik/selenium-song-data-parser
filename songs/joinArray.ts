const firstArray: Song[] = require('./PartOfsongs.json');
const secondArray: Song[] = require('./PartOfsongs2.json');
const thirdArray: Song[] = require('./songs3.json');

const joinedArray = firstArray.concat(secondArray.concat(thirdArray));
const clearArray = filter(joinedArray, ((song) => song.time));


const statistic: Record<string, number> = {};
for (const i of clearArray) {
    const key = i.author + ' - ' + i.song
    if(statistic[key]) {
        statistic[key] += 1;
    } else {
        statistic[key] = 1
    }
}

function filter(array: Song[], key: (x: Song) => string) {
  return [
    ...new Map(
      array.map(x => [key(x), x])
    ).values()
  ]
}

type Song = {
  author: string;
  song: string;
  time: string;
}

console.log(statistic);
