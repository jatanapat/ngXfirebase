import { AngFirePage } from './app.po';

describe('ang-fire App', () => {
  let page: AngFirePage;

  beforeEach(() => {
    page = new AngFirePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
