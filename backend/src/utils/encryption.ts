import * as crypto from 'crypto';
import { Buffer } from 'node:buffer';

export function encrypt(text: string, key: string, iv: string)
{
    const algorithm = 'aes-256-cbc';
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

export function decrypt(text: string, key: string, iv: string)
{
    const algorithm = 'aes-256-cbc';
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}