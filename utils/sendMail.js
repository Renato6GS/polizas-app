export const sendMail = async ({ email, fullname, subject, message }) => {
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
