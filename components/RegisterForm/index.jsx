import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './validations.js';

import styles from './styles.module.css';
import FirstStepForm from './stepsForm/firstStepForm.jsx';
import SecondStepForm from './stepsForm/SecondStepForm.jsx';
import ThirdStepForm from './stepsForm/ThirdStepForm.jsx';

export default function RegisterForm() {
  const [formStep, setFormStep] = useState(0);
  const [isSure, setIsSure] = useState(false);

  const ImSure = (value) => setIsSure(value);

  const nextStep = () => {
    ImSure(false);
    setFormStep((cur) => cur + 1);
  };

  const previousStep = () => {
    ImSure(false);
    setFormStep((cur) => cur - 1);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit = (values) => {
    if (!isSure) return false;
    console.log(values);
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inputsContainer}>
        {formStep === 0 && (
          <FirstStepForm register={register} errors={errors} control={control} title='Datos sobre el cliente' />
        )}
        {formStep === 1 && (
          <SecondStepForm register={register} errors={errors} control={control} title='Datos sobre la póliza' />
        )}

        {formStep === 2 && (
          <ThirdStepForm register={register} errors={errors} control={control} title='Datos sobre la aseguradora' />
        )}
      </div>

      <div className='line-horizontal'></div>

      <div className={styles.buttonsContainer}>
        {formStep > 0 && (
          <button onClick={previousStep} className='btn btn-empty'>
            Regresar
          </button>
        )}
        {formStep === 2 ? (
          <button onClick={() => ImSure(true)} type='submit' className='btn'>
            Enviar
          </button>
        ) : (
          <button onClick={nextStep} type='button' className='btn'>
            Siguiente
          </button>
        )}
      </div>
    </form>
  );
}
