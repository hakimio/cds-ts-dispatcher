import { Book } from '#cds-models/CatalogService';

import { TypedRequest } from '@sap/cds';

import { MiddlewareImpl, NextMiddleware } from '../../../../lib/types/types';

export class MiddlewareMethodAfterRead2 implements MiddlewareImpl {
  public async use(req: TypedRequest<Book>, next: NextMiddleware) {
    console.log('Middleware 2: @AfterRead');

    req.notify('MiddlewareAfterRead2');

    await next();
  }
}