import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, number } from 'yup';
import { messageErrors } from 'constants/messageErros';

import styles from './styles.module.css';
import FieldForm from 'components/FieldForm';

const schema = object()
  .shape({
    no_cliente: number()
      .typeError(`${messageErrors['mNumberTypeError']}`)
      .positive(`${messageErrors['mPositive']}`)
      .integer(`${messageErrors['mInteger']}`)
      .required(`${messageErrors['mRequired']}`),
    nombre_cliente: string().typeError(messageErrors['mStringTypeError']).required(messageErrors['mRequired']),
    apellidos_cliente: string().typeError(messageErrors['mStringTypeError']).required(messageErrors['mRequired']),
  })
  .required();

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inputsContainer}>
        <FieldForm
          id={'no_cliente'}
          label={'Número de cliente'}
          placeholder={'Ej.: 39123'}
          register={register}
          errors={errors}
        />
        <FieldForm
          id={'nombre_cliente'}
          label={'Nombre del cliente'}
          placeholder={'Ej.: Luis Arturo'}
          register={register}
          errors={errors}
        />
        <FieldForm
          id={'apellidos_cliente'}
          label={'Apellidos del cliente'}
          placeholder={'Ej.: Ramírez Salguero'}
          register={register}
          errors={errors}
        />
        <select {...register('gender')}>
          <option value='female'>female</option>
          <option value='male'>male</option>
          <option value='other'>other</option>
        </select>
      </div>

      <div className='line-horizontal'></div>

      <div className={styles.buttonsContainer}>
        <button className='btn btn-empty'>Cancelar</button>
        <button type='submit' className='btn'>
          Siguiente
        </button>
      </div>
    </form>
  );
}
