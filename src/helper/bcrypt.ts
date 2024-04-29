import bcrypt from 'bcrypt'

export const hash = (plainText: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainText, 10, (err: any, result: string) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

export const compare = (plainText: string, hashedText: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainText, hashedText, (err: any, result: any) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
