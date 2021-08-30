import * as bcrypt from 'bcrypt';
import { unlink } from 'fs';
import { promisify } from 'util';

export class UtilsService {
  /**
   * convert entity to dtos class instance
   * @param {{new(entity: E, options: any): T}} model
   * @param {E[] | E} entity
   * @param options
   * @returns {T[] | T}
   */
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E,
    options?: Record<string, any>,
  ): T;
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E[],
    options?: Record<string, any>,
  ): T[];
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E | E[],
    options?: Record<string, any>,
  ): T | T[] {
    if (Array.isArray(entity)) {
      return entity.map((u) => new model(u, options));
    }

    return new model(entity, options);
  }

  static generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  static validateHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static async deleteFile(filePath: string): Promise<void> {
    const unlinkAsync = promisify(unlink);
    await unlinkAsync(filePath);
  }

  static getRandomEnumValue(e: { [k: number]: string }): string | number {
    const keys = Object.keys(e);
    const enumKey = keys[Math.floor(Math.random() * keys.length)];
    return e[enumKey];
  }
}
