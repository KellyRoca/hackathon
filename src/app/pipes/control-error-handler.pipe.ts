import { Pipe, PipeTransform } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

@Pipe({
  name: "controlErrorHandler",
})
export class ControlErrorHandlerPipe implements PipeTransform {
  //TO DO: Custom email Pattern.

  private errorResolver = {
    required: () => "Es requerido.",
    email: () => "El correo electrónico no es válido.",
    minlength: (error) => `Debe tener mínimo ${error.requiredLength} caracteres.`,
    maxlength: (error) => `Debe tener máximo ${error.requiredLength} caracteres.`,
    matching: () => `Ambas contraseñas deben ser iguales`,
    isRuc20: () => `Debe ser un RUC 20.`,
    isInvalidAccount: () => `El número de cuenta es inválido`,
    backendErrorMessage: (error) => `${error}`,
    cannotContainSpace: () => `No puede contener espacios.`,
    oneUpperCaseLetter: () => `Debe contener al menos una letra mayúscula.`,
    oneLowerCaseLetter: () => `Debe contener al menos una letra minúscula.`,
    hasNumber: () => `Debe contener al menos un número.`,
    hasSpecialCharacters: () => `Debe contener al menos un símbolo.`,
    // customErrorKey: (error) => `Password should be at least ${error.quantity} characters length`
  };

  transform(errorKeys: ValidationErrors): string | any {
    const validatorError = Object.keys(errorKeys || {})[0];
    if (this.errorResolver[validatorError]) {
      return this.errorResolver[validatorError](errorKeys[validatorError]);
    }
  }
}
