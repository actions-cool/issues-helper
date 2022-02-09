import { replaceStr2Arr } from '../src/util';

describe('Test', () => {
  it('test doQueryIssues', () => {
    const issues = [
      {
        id: 0,
        labels: [{ name: '0' }, { name: '1' }],
      },
      {
        id: 1,
        labels: [{ name: '1' }, { name: '2' }],
      },
      {
        id: 2,
        labels: [{ name: '2' }, { name: '3' }],
      },
      {
        id: 3,
        labels: [{ name: '1' }, { name: '4' }],
      },
      {
        id: 4,
        labels: [{ name: '1' }, { name: '3' }],
      },
      {
        id: 5,
        labels: [{ name: '1' }, { name: '5' }],
      },
    ];

    let ex = ['2', '4'];
    let r = [];

    issues.forEach(iss => {
      for (let i = 0; i < iss.labels.length; i += 1) {
        if (ex.includes(iss.labels[i].name)) return;
      }
      r.push(iss);
    });

    expect(r[0].id).toEqual(0);
    expect(r[1].id).toEqual(4);
    expect(r[2].id).toEqual(5);
    expect(r.length).toEqual(3);
  });

  it('test replaceStr2Arr', () => {
    const st = '/assign @1 @2 @3@a 3  @s @1_2 2';
    const re = '/assign';
    const sp = '@';

    expect(replaceStr2Arr(st, re, sp)).toEqual(['1', '2', '3', 'a 3', 's', '1_2 2']);
  });
});
