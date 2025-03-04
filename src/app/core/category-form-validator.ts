import { FormGroup } from "@angular/forms";

export const isRequired = (field: 'name', form: FormGroup) => {
    const control = form.get(field);

    return control && control.touched && control.hasError('required')
}