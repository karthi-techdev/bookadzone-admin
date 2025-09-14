import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const toast = (message: string, icon: 'error' | 'success' | 'warning' | 'info' = 'error') => {
  MySwal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    icon,
    title: message,
  });
};