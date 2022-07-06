import { Matrix } from 'ml-matrix';

export class Vector2D
{
    constructor
    (
        public x: number,
        public y: number,
    )
    { }
}

export function getMatrix(v: Vector2D): Matrix
{
    return new Matrix([[v.x, v.y]]);
}

export function getVector(m: Matrix): Vector2D
{
    return new Vector2D(m[0][0], m[0][1]);
}

export function scale(v: Vector2D, scalar: number): Vector2D
{
    return new Vector2D(v.x * scalar, v.y * scalar);
}

export function rounded(v: Vector2D, precision: number): Vector2D
{
    let factor = Math.pow(10, precision);
    return new Vector2D(Math.round(v.x * factor), Math.round(v.y * factor));
}

export function getMagnitude(v: Vector2D) : number
{
    let magnitude: number;

    magnitude = Math.pow(v.x, 2) + Math.pow(v.y, 2);
    magnitude = Math.sqrt(magnitude);
    return magnitude;
}

/*
** transform any vector in 1-magnitude equivalent
*/
export function normalize(v: Vector2D) : Vector2D
{
    let normalizedV: Vector2D = new Vector2D(0, 0);
    let magnitude: number = getMagnitude(v);
    normalizedV.x = v.x / magnitude;
    normalizedV.y = v.y / magnitude;
    return normalizedV;
}

/*
** v1, v2 must be normalized
** return angle in radians
*/
export function getAngle(v1: Vector2D, v2: Vector2D): number
{
    let dotProduct: number = v1.x * v2.x + v1.y * v2.y;
    return Math.acos(dotProduct);
}

export function rotate(v: Vector2D, angle: number): Vector2D
{
    let rotM = new Matrix(
        [[Math.cos(angle), -Math.sin(angle)],
        [Math.sin(angle), Math.cos(angle)]]
    )
    let resM = getMatrix(v).multiply(rotM);
    return getVector(resM);
}

export function invert(v: Vector2D): Vector2D
{
    return new Vector2D(v.x * -1, v.y * -1);
}

export function invertX(v: Vector2D): Vector2D
{
    return new Vector2D(v.x * -1, v.y);
}

export function invertY(v: Vector2D): Vector2D
{
    return new Vector2D(v.x, v.y * -1);
}

export function getReflectedVector(v: Vector2D, normal: Vector2D): Vector2D
{
    let reflect: Vector2D;

    let incidentAngle = getAngle(invert(v), normal);
    reflect = rotate(v, -incidentAngle);
    return reflect;
}