import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function InputField({ placeholder }: { placeholder: string }) {
  return (
    <Field>
      <FieldLabel className='text-md' htmlFor={`input-field-${placeholder}`}>
        {placeholder}
      </FieldLabel>
      <Input
        id={`input-field-${placeholder}`}
        type='text'
        placeholder={`Enter your ${placeholder}`}
        className='bg-white h-10'
      />
    </Field>
  );
}
