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

  const onSubmit = async (values) => {
    if (!isSure) return false;
    console.log(values);
    const {
      apellidos_cliente,
      asunto_endoso,
      comboBranches,
      comboDay,
      comboDocument,
      comboEconomicGroups,
      comboGender,
      comboInsurers,
      comboMonth,
      comboYear,
      correo_cliente,
      created_by: creado_por,
      direccion_cliente,
      no_cliente,
      no_solicitud_acs,
      nombre_cliente,
      numero_de_poliza,
      numero_de_tel_cliente,
      numero_endoso_aseguradora,
      price: precio,
    } = values;
    const idBra = comboBranches.id;
    const idDay = comboDay.id;
    const idDoc = comboDocument.id;
    const idGro = comboEconomicGroups.id;
    const idGen = comboGender.id;
    const idIns = comboInsurers.id;
    const idMon = comboMonth.id;
    const idYea = comboYear.id;

    try {
      const success = await fetch(
        `/api/insertDocument?apellidos_cliente=${apellidos_cliente}&asunto_endoso=${asunto_endoso}&ramo_de_seguro=${idBra}&id_dia=${idDay}&tipo_de_documento=${idDoc}&grupo_economico=${idGro}&id_gender=${idGen}&aseguradora=${idIns}&id_mes=${idMon}&id_anio=${idYea}&correo_cliente=${correo_cliente}&creado_por=${creado_por}&direccion_cliente=${direccion_cliente}&no_cliente=${no_cliente}&no_solicitud_acs=${no_solicitud_acs}&nombre_cliente=${nombre_cliente}&numero_de_poliza=${numero_de_poliza}&numero_de_tel_cliente=${numero_de_tel_cliente}&numero_endoso_asegurador=${numero_endoso_aseguradora}&precio=${precio}`
      );
      const { estado } = await success.json();
      if (estado) {
        alert('los datos se insertaron correctamente sii');
      } else {
        alert('hubo un fallo');
      }
    } catch (error) {
      console.log('fallo el fetch');
      console.log(error);
    }
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
