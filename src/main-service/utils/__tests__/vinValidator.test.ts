import { VinValidator } from '../../services/vinValidator';

describe('VIN Validator', () => {
  describe('validate', () => {
    it('should accept valid 17-character VINs', () => {
      expect(VinValidator.validate('1HGBH41JXMN109186').isValid).toBe(true);
      expect(VinValidator.validate('2FTEX1E84BCA12345').isValid).toBe(true);
      expect(VinValidator.validate('WVWZZZ1JZYW123456').isValid).toBe(true);
    });

    it('should accept VINs with numbers and uppercase letters', () => {
      expect(VinValidator.validate('ABCDEFGH123456789').isValid).toBe(true);
      expect(VinValidator.validate('123456789ABCDEFGH').isValid).toBe(true);
      expect(VinValidator.validate('1A2B3C4D5E6F7G8H9').isValid).toBe(true);
    });

    it('should reject VINs shorter than 17 characters', () => {
      expect(VinValidator.validate('1HGBH41JXMN10918').isValid).toBe(false);
      expect(VinValidator.validate('SHORT').isValid).toBe(false);
      expect(VinValidator.validate('').isValid).toBe(false);
    });

    it('should reject VINs longer than 17 characters', () => {
      expect(VinValidator.validate('1HGBH41JXMN1091866').isValid).toBe(false);
      expect(VinValidator.validate('1HGBH41JXMN109186EXTRA').isValid).toBe(false);
    });

    it('should accept VINs with lowercase letters and normalize them', () => {
      const result1 = VinValidator.validate('1hgbh41jxmn109186');
      expect(result1.isValid).toBe(true);

      const result2 = VinValidator.validate('1HGBH41JXMn109186');
      expect(result2.isValid).toBe(true);
    });

    it('should reject VINs with invalid characters (I, O, Q)', () => {
      expect(VinValidator.validate('1HGBH41JXMN10918I').isValid).toBe(false);
      expect(VinValidator.validate('1HGBH41JXMN10918O').isValid).toBe(false);
      expect(VinValidator.validate('1HGBH41JXMN10918Q').isValid).toBe(false);
    });

    it('should reject VINs with special characters', () => {
      expect(VinValidator.validate('1HGBH41JXMN10918-').isValid).toBe(false);
      expect(VinValidator.validate('1HGBH41JXMN10918_').isValid).toBe(false);
      expect(VinValidator.validate('1HGBH41JXMN10918.').isValid).toBe(false);
      expect(VinValidator.validate('1HGBH41JXMN10918 ').isValid).toBe(false);
    });

    it('should reject null and undefined', () => {
      expect(VinValidator.validate(null as any).isValid).toBe(false);
      expect(VinValidator.validate(undefined as any).isValid).toBe(false);
    });

    it('should provide error messages for invalid VINs', () => {
      const result1 = VinValidator.validate('SHORT');
      expect(result1.isValid).toBe(false);
      expect(result1.error).toContain('17 characters');

      const result2 = VinValidator.validate('');
      expect(result2.isValid).toBe(false);
      expect(result2.error).toBeDefined();
    });
  });

  describe('normalize', () => {
    it('should convert VIN to uppercase', () => {
      expect(VinValidator.normalize('1hgbh41jxmn109186')).toBe('1HGBH41JXMN109186');
      expect(VinValidator.normalize('AbCdEfGh123456789')).toBe('ABCDEFGH123456789');
    });
  });
});
