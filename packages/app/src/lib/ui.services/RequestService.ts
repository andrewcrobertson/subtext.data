import type { GitHubService } from './GitHubService';
import type { MyIdService } from './MyIdService';
import type * as T from './RequestService.types';

export class RequestService {
  public constructor(
    private readonly myIdService: MyIdService,
    private readonly gitHubService: GitHubService
  ) {}

  public async submitRequest(imdbIdOrImdbUrl: string): Promise<T.SubmitRequestOutput> {
    const myId = await this.myIdService.getMyId();
    console.log(myId);
    // const x = await this.gitHubService.submitIssue(imdbIdOrImdbUrl)
    return { success: true };
  }

  public getImdbQueryUrl(query: string): string {
    return `https://www.imdb.com/find/?q=${query}&s=tt&ttype=ft&ref_=subtext`;
  }
}
