import {test} from 'node:test';
import assert from 'node:assert/strict';
await import('../public/hand-control.js');
const {Gesture}=globalThis.JoranHand;
test('hand control requires open fingers, stable pinch, then a separate upward movement',()=>{
 const g=new Gesture();
 assert.equal(g.feed({ratio:.2,palm:.6,target:1},0).state,'open');
 assert.equal(g.feed({ratio:1,palm:.6,target:1},80).state,'aim');
 assert.equal(g.feed({ratio:.2,palm:.6,target:1},160).state,'pinch');
 assert.equal(g.feed({ratio:.2,palm:.6,target:1},500).state,'pinch');
 assert.equal(g.feed({ratio:.2,palm:.6,target:1},620).state,'selected');
 assert.equal(g.feed({ratio:.2,palm:.43,target:1},750).state,'lift');
 assert.equal(g.feed({ratio:1,palm:.58,target:0},1000).state,'lift');
 assert.deepEqual(g.feed({ratio:1,palm:.4,target:0},1080),{state:'caught',index:1});
 assert.equal(g.feed({ratio:1,palm:.4,target:0},1200).state,'done');
});
test('target changes, lost hands and invalid landmarks cannot complete an old selection',()=>{
 const g=new Gesture();g.feed({ratio:1,palm:.6,target:0},0);
 g.feed({ratio:.2,palm:.6,target:0},100);
 assert.equal(g.feed({ratio:.2,palm:.6,target:2},500).progress,0);
 assert.equal(g.feed(null,600).state,'missing');
 assert.equal(g.feed({ratio:.2,palm:.4,target:2},900).state,'open');
 g.feed({ratio:1,palm:.6,target:2},1000);g.feed({ratio:.2,palm:.6,target:2},1100);g.feed({ratio:.2,palm:.6,target:2},1600);
 assert.equal(g.feed({ratio:NaN,palm:.3,target:2},2000).state,'missing');
 assert.equal(g.feed({ratio:.2,palm:.3,target:2},2500).state,'open');
});
