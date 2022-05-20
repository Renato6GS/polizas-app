export const eliminarPoliza = async ({ idPoliza }) => {
  try {
    await fetch(`/api/deletePolicy?idPoliza=${idPoliza}`);
    alert('Eliminado correctamente.');
  } catch (error) {
    alert('No se pudo eliminar la póliza.');
    console.log(error);
  }
};
