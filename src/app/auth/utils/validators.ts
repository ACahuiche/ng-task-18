import { FormGroup } from "@angular/forms";

export const isRequired = (field: 'email' | 'password' | 'confirmPassword', form: FormGroup) => {
    const control = form.get(field);

    return control && control.touched && control.hasError('required')
}

export const hasEmailError = (form: FormGroup) => {
    const control = form.get('email');

    return control && control.touched && control.hasError('email');
}

export const confirmedPassword = (form: FormGroup) => {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    console.log('pass ', password?.value, 'confirm ', confirmPassword?.value);

    return password && confirmPassword && password.value !== confirmPassword.value;
}
