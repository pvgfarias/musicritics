import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/login/inputField';
import Link from 'next/link';
import { Login01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';

export default function Login() {
  return (
    <div className='bg-amber-50 w-2/5 flex justify-center items-center'>
      <div className='flex flex-col gap-8 font-title w-lg h-96 opacity-0 animate-pop-in'>
        <h1 className='text-4xl'>LOGIN</h1>
        <form className='flex flex-col gap-4'>
          <InputField placeholder={'email'} />
          <InputField placeholder={'password'} />
          <div className='flex flex-row justify-between'>
            <div className='flex flex-row gap-2 justify-center items-center'>
              <Checkbox id='remember-me-checkbox' name='remember-me-checkbox' />
              <Label htmlFor='remember-me-checkbox' className='text-md'>
                remember me
              </Label>
            </div>
            <Link href='/forgot-password' className='text-primary'>
              forgot my password
            </Link>
          </div>
          <Button size={'lg'} className='h-12 text-lg'>
            login
            <HugeiconsIcon
              icon={Login01Icon}
              size={40}
              color='currentColor'
              strokeWidth={1.5}
            />{' '}
          </Button>
          <Button size={'lg'} variant={'secondary'} className='h-12 text-lg'>
            <Image alt='google logo' src='/google.svg' width={20} height={20} />
            &nbsp; continue with google
          </Button>
        </form>

        <div className='flex flex-col justify-center items-center gap-4'>
          <h3>don&apos;t have an account?</h3>
          <Link href='/' className='text-primary'>
            register now !
          </Link>
        </div>
      </div>
    </div>
  );
}
