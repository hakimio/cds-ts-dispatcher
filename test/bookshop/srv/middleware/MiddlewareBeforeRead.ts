import type { Book } from '#cds-models/CatalogService';

import type { TypedRequest } from '@sap/cds';

import type { MiddlewareImpl, NextMiddleware } from '../../../../lib/types/types';

export class MiddlewareMethodBeforeRead implements MiddlewareImpl {
  public async use(req: TypedRequest<Book>, next: NextMiddleware): Promise<void> {
    console.log('Middleware 1: @BeforeRead');
    await next();
  }
}
