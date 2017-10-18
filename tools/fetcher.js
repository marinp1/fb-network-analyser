require('dotenv').config();

const puppeteer = require('puppeteer');

const helpers = require('./helpers');
const classes = require('./classes');
const parser = require('./parser')

const USER_EMAIL = process.env.FACEBOOK_USER_EMAIL;
const PASSWORD = process.env.FACEBOOK_USER_PASSWORD;
const USERNAME = process.env.FACEBOOK_USERNAME;

const ALL_FRIENDS_PAGE_URL = `https://www.facebook.com/login/?next=https://www.facebook.com${USERNAME}/friends_all`;

const EMAIL_SELECTOR = '#email';
const PASSWORD_SELECTOR = '#pass';
const LOGIN_SELECTOR = '#loginbutton';

const friendList = [];

const egocenter = new classes.FriendNode(USERNAME);
friendList.push(egocenter);

(async () => {

  const browser = await puppeteer.launch({
    headless: true, // set to false to observe and debug
    timeout: 0,
    args: ['--disable-notifications']
  });

  const page = await browser.newPage();

  await page.goto(ALL_FRIENDS_PAGE_URL);
  await page.type(EMAIL_SELECTOR, USER_EMAIL, {delay: 50});
  await page.type(PASSWORD_SELECTOR, PASSWORD, {delay: 50});
  await page.click(LOGIN_SELECTOR);
  await page.waitForNavigation();

  await helpers.setFriendNodeName(page, egocenter);
  await helpers.scrollPage(page);
  const friendIds = await helpers.getFriends(page);

  let i = 1;

  for (id of friendIds) {
    egocenter.addFriend(id);
    
    const newFriend = new classes.FriendNode(id);
    await page.goto(`https://www.facebook.com${id}/friends_mutual`);
    await helpers.setFriendNodeName(page, newFriend);

    await helpers.scrollPage(page);
    const mutualIds = await helpers.getFriends(page);

    newFriend.addFriends(mutualIds);
    friendList.push(newFriend);

    console.log(`${i++}: Friend ${newFriend.name} added with ${newFriend.friends.length} mutual friends.`)

    await helpers.delay(50);
  }

  console.log(`Network structure created with ${friendList.length} elements.`);
  parser.parseData(USERNAME, friendList);

  await browser.close();

})();