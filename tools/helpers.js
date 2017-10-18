const FRIEND_ELEMENT_SELECTOR = 'li._698 > div > a';
const FRIEND_NAME_SELECTOR = '#fb-timeline-cover-name';
const SEPARATOR_SELECTOR = '#timeline-medley > div > div.mbm._5vf.sectionHeader._4khu';

const delay = function(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

module.exports = {

  delay: delay,

  // Scroll page until separator element shows up (all the friends are visible)
  scrollPage: async function(page) {
    let exists = !!(await page.$(SEPARATOR_SELECTOR));
    
    while (!exists) {
      await page.evaluate(_ => {
        window.scrollBy(0, document.body.scrollHeight);
      });
      await delay(500);
      exists = !!(await page.$(SEPARATOR_SELECTOR));
    }
  },

  // Get all friends elements excluding people without a username
  getFriends: async function(page) {
    return await page.evaluate((sel) => {
      let elements = Array.from(document.querySelectorAll(sel));
      const pathNames = elements.map(element => {
        return element.pathname;
      });
      return pathNames.filter(_ => _ !== '/profile.php');
    }, FRIEND_ELEMENT_SELECTOR);
  },

  setFriendNodeName: async function(page, node) {
    node.setName(await page.evaluate((sel) => {
      return document.querySelector(sel).innerText;
    }, FRIEND_NAME_SELECTOR));
  }

}