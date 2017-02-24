import { CraftQueuePage } from './app.po';

describe('craft-queue App', function() {
  let page: CraftQueuePage;

  beforeEach(() => {
    page = new CraftQueuePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
