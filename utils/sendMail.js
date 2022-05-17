export const sendMail = async ({ email, fullname, subject, message }) => {
  console.log('estamos a casi entrar al sendgrind, los datos llegados son:');
  console.log(email);
  console.log(fullname);
  console.log(subject);
  const res = await fetch('/api/sendgrid', {
    body: JSON.stringify({
      email,
      fullname,
      subject,
      message,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const { error } = await res.json();
  if (error) {
    console.log(error);
    return;
  }
  console.log('El correo ha sido enviado exitósamente.');
  return true;
};
