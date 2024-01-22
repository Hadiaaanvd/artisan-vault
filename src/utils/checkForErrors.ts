export const checkForErrors = (response: any) => {
  if (!response.success) {
    const errorObject = {
      status: 400,
      message: response.message || response.error || "",
    };
    throw errorObject;
  }
};
