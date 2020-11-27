import {Catch, ExceptionFilterMethods, PlatformContext, ResponseErrorObject} from "@tsed/common";

@Catch(Error)
export class CustomerGEHMiddleware implements ExceptionFilterMethods {

  catch(exception: any, ctx: PlatformContext): any {
    const {response} = ctx;
    // DO SOMETHING
    console.error("==============================");

    const error = this.mapError(exception);
    const headers = this.getHeaders(exception);

    return (response as any).headers(headers).status(500).body(error);
  }

  mapError(error: any) {
    return {
      name: error.origin?.name || error.name,
      message: error.message,
      status: error.status || 500,
      errors: this.getErrors(error),
    };
  }

  protected getErrors(error: any) {
    return [error, error.origin].filter(Boolean).reduce((errs, {errors}: ResponseErrorObject) => {
      return [...errs, ...(errors || [])];
    }, []);
  }

  protected getHeaders(error: any) {
    return [error, error.origin].filter(Boolean).reduce((obj, {headers}: ResponseErrorObject) => {
      return {
        ...obj,
        ...(headers || {}),
      };
    }, {});
  }

}
