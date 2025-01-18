import { AxiosError } from "axios";

export default function errorHandler(error: Error) {
  if (error instanceof AxiosError) {
    // toast.error(e.response?.data.message);
    console.log(error.response?.data.message);
  } else {
    // toast.error('An error occured');
    console.log(error);
  }
}