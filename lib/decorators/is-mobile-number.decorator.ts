import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isMobileNumber', async: false })
export class IsMobileNumberConstraint implements ValidatorConstraintInterface {
  validate(mobileNumber: string) {
    const mobileNumberRegex = /^\+\d{11}$/;
    return mobileNumberRegex.test(mobileNumber);
  }

  defaultMessage() {
    return 'Invalid mobile number';
  }
}

export function IsMobileNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMobileNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsMobileNumberConstraint,
    });
  };
}
