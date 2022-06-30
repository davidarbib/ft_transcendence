import {
    Vector2D,
    normalize,
    rounded,
    getAngle,
    invert,
} from './vector.utils';

function zoom(r: number, p: number)
{
    return Math.round(r * Math.pow(10, p));
}

let precision : number = 4;

/*
** normalize
*/
let vecToNormalize : Vector2D = {x: 0, y: 2};
let normalizeRes : Vector2D = {x: 0, y: 1};

let vecToNormalize2 : Vector2D = {x: 6, y: -3};
let normalizeRes2 : Vector2D = {x: 8944, y: -4472};

test('normalize (0, 2)', () => {
    expect(normalize(vecToNormalize)).toEqual(normalizeRes);
})

test('normalize (6, -3)', () => {
    expect(rounded(normalize(vecToNormalize2), precision)).toEqual(normalizeRes2);
})

/*
** getAngle
*/
let vecBegin : Vector2D = { x: 1, y: 0};
let vecEnd : Vector2D = { x: 0, y: 1};
let resAngle : number = zoom(Math.PI / 2, precision);

let vecBegin2 : Vector2D = { x: 1, y: 0};
let vecEnd2 : Vector2D = { x: 1, y: 1};
let resAngle2 : number = zoom(Math.PI / 4, precision);

test('angle between (1, 0) and (0, 1)', () => {
    expect(zoom(getAngle(vecBegin, vecEnd), precision)).toEqual(resAngle);
})

test('angle between (1, 0) and (1, 1)', () => {
    expect(zoom(getAngle(vecBegin2, normalize(vecEnd2)), precision)).toEqual(resAngle2);
})

/*
** invert
*/
let vecToInvert : Vector2D = new Vector2D(1, 0);
let vecInverted : Vector2D = new Vector2D(-1, -0);

let vecToInvert2 : Vector2D = new Vector2D(0, 1);
let vecInverted2 : Vector2D = new Vector2D(-0, -1);

let vecToInvert3 : Vector2D = new Vector2D(1, 1);
let vecInverted3 : Vector2D = new Vector2D(-1, -1);

test('invert (1, 0)', () => {
    expect(invert(vecToInvert)).toEqual(vecInverted);
})

test('invert (0, 1)', () => {
    expect(invert(vecToInvert2)).toEqual(vecInverted2);
})

test('invert (1, 1)', () => {
    expect(invert(vecToInvert3)).toEqual(vecInverted3);
})