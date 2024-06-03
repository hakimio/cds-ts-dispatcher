/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import {
  ActionRequest,
  ActionReturn,
  AfterAll,
  CDS_DISPATCHER,
  EntityHandler,
  Inject,
  Next,
  NextEvent,
  OnBoundAction,
  OnBoundFunction,
  OnCreate,
  OnDelete,
  OnRead,
  OnUpdate,
  Req,
  Request,
  RequestResponse,
  Res,
  Result,
  Service,
  SingleInstanceSwitch,
  TypedRequest,
} from '../../../../../../lib';
import { BookStat } from '../../../../@cds-models/CatalogService';
import AuthorService from '../../../service/AuthorService';
import BookStatsService from '../../../service/BookStatsService';

@EntityHandler(BookStat)
class BookStatsHandler {
  @Inject(CDS_DISPATCHER.SRV) private readonly srv: Service;
  @Inject(BookStatsService) private readonly bookStatsService: BookStatsService;
  @Inject(AuthorService) private readonly authorService: AuthorService;

  @OnCreate()
  public async create(@Req() req: TypedRequest<BookStat>, @Next() next: NextEvent) {
    this.bookStatsService.notifyCreated(req);
    return next();
  }

  @AfterAll()
  private async afterAll(
    @Req() req: Request,
    @Res() res: RequestResponse,
    @Result() result: BookStat | BookStat[] | boolean,
  ): Promise<void> {
    if (Array.isArray(result)) {
      // when after `read` event was triggered
      console.log('READ');
    } else if (typeof result === 'boolean') {
      // when after `delete` event was triggered
      console.log('DELETE');
    } else {
      // when after `create`, `update` as triggered
      console.log('CREATE and UPDATE');
    }

    res.setHeader('CustomHeader', 'AfterAllTriggered');
  }

  @OnRead()
  public async read(
    @Req() req: TypedRequest<BookStat>,
    @Next() next: NextEvent,
    @SingleInstanceSwitch() isSingleInstance: boolean,
  ) {
    if (isSingleInstance) {
      return await this.bookStatsService.updatedViews(req);
    }

    return next();
  }

  @OnUpdate()
  public async update(@Req() req: TypedRequest<BookStat>, @Next() next: NextEvent) {
    this.bookStatsService.notifyUpdated(req);
    return next();
  }

  @OnDelete()
  public async delete(@Req() req: Request, @Next() next: NextEvent) {
    this.bookStatsService.notifyDeleted(req);
    return next();
  }

  // This action will be triggered on the 'BookStat' entity
  @OnBoundAction(BookStat.actions.GenerateReport)
  public async generateReport(
    @Req() req: ActionRequest<typeof BookStat.actions.GenerateReport>,
    @Next() next: NextEvent,
  ): ActionReturn<typeof BookStat.actions.GenerateReport> {
    return await this.bookStatsService.handleReport(req);
  }

  // This function will be triggered on the 'BookStat' entity
  @OnBoundFunction(BookStat.actions.NotifyAuthor)
  public async notifyAuthor(
    @Req() req: ActionRequest<typeof BookStat.actions.NotifyAuthor>,
    @Next() next: NextEvent,
  ): ActionReturn<typeof BookStat.actions.NotifyAuthor> {
    return await this.authorService.notifyAuthor(req);
  }
}

export default BookStatsHandler;
