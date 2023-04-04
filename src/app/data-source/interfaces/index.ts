import { PaginationRequest } from './pagination-request.interface';
import { DefaultPagination } from './default-pagination.interface';

export { PaginationRequest, DefaultPagination };

export const toDataURL = (url: string): Promise<any> =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
