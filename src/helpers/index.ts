import crypto from 'crypto';

export const random = () => crypto.randomBytes(16).toString('hex');
export const authentication = async (salt: string, data: string) => {
  if (!salt || !data) {
    throw new Error('Salt and data are required for authentication');
  }

  return crypto
    .createHmac('sha256', [salt, data].join('/'))
    .update(data)
    .digest('hex');
};
