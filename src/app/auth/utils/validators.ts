import { FormGroup } from "@angular/forms";

export const isRequired = (field: 'email' | 'password' | 'confirmPassword', form: FormGroup) => {
    const control = form.get(field);

    return control && control.touched && control.hasError('required')
}

export const hasEmailError = (form: FormGroup) => {
    const control = form.get('email');

    return control && control.touched && control.hasError('email');
}

export const hasUrlError = (form: FormGroup) => {
    const control = form.get('urlSite');
  
    return control && control.touched && control.hasError('pattern');
}

export const confirmedPassword = (form: FormGroup) => {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    return password && confirmPassword && password.value !== confirmPassword.value;
}

export const validateMinLenght = (form: FormGroup) => {
    const control = form.get('password');

    return control && control.touched && control.hasError('minlength');
}

export const isRequiredToSave = (field: 'title' | 'urlSite' | 'description', form: FormGroup) => {
    const control = form.get(field);

    return control && control.touched && control.hasError('required')
}
