import { vinValidationCounter } from '../../shared/metrics';
import logger from '../../shared/logger';

export class VinValidator {
  private static readonly VIN_LENGTH = 17;
  private static readonly VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;
  private static readonly EXCLUDED_CHARS = ['I', 'O', 'Q'];

  static validate(vin: string, correlationId?: string): {
    isValid: boolean;
    error?: string;
  } {
    logger.debug('Validating VIN', { vin, correlationId });

    if (!vin) {
      vinValidationCounter.inc({ status: 'missing' });
      return {
        isValid: false,
        error: 'VIN is required',
      };
    }

    const upperVin = vin.toUpperCase();

    if (upperVin.length !== this.VIN_LENGTH) {
      vinValidationCounter.inc({ status: 'invalid_length' });
      return {
        isValid: false,
        error: `VIN must be exactly ${this.VIN_LENGTH} characters`,
      };
    }

    if (!this.VIN_PATTERN.test(upperVin)) {
      vinValidationCounter.inc({ status: 'invalid_format' });
      return {
        isValid: false,
        error: `VIN must be alphanumeric and cannot contain ${this.EXCLUDED_CHARS.join(', ')}`,
      };
    }

    vinValidationCounter.inc({ status: 'valid' });
    logger.debug('VIN validation successful', { vin: upperVin, correlationId });

    return { isValid: true };
  }

  static normalize(vin: string): string {
    return vin.toUpperCase();
  }
}
