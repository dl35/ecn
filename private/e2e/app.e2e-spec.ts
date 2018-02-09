import { ServerPage } from './app.po';

describe('server App', () => {
  let page: ServerPage;

  beforeEach(() => {
    page = new ServerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
