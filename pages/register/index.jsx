import Layout from 'components/Layout/Layout.jsx';
import RegisterForm from 'components/RegisterForm';

export default function Register() {
  return (
    <Layout>
      <h2 className='title'>Vista: Aseguradoras</h2>

      <h2 className='sub-title'>Inicio de asignación</h2>

      <p className='description'>Ingrese la siguiente documentación para el inicio del proceso</p>
      <div className='line-horizontal'></div>

      {/* <h2 className='sub-title'>Datos del cliente</h2> */}
      <RegisterForm />
    </Layout>
  );
}
