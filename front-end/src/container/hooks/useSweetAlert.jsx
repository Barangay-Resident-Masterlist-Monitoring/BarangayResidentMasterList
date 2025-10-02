import Swal from 'sweetalert2';

const useSweetAlert = () => {
  const fireSuccess = (title = 'Success', text = '', confirmBtnColor = '#228B22') => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: confirmBtnColor,
    });
  };

  const fireError = (title = 'Error', text = '', confirmBtnColor = '#228B22') => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: confirmBtnColor,
    });
  };

  const fireConfirm = (title = 'Are you sure?', text = '', confirmBtnColor = '#228B22') => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: confirmBtnColor,
    });
  };

  return { fireSuccess, fireError, fireConfirm };
};

export default useSweetAlert;
