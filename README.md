# Facebook network analyzer
This tool creates a 1.5 degree network of your Facebook friends.
Uses [headless Chrome](https://github.com/GoogleChrome/puppeteer) for web scraping to retrieve the data and [D3.js](https://d3js.org/) to display it. Application created on top of [create-react-app](https://github.com/facebookincubator/create-react-app).

## Features
* Node size is based on the node's degree
* Hovering over a node displays the name and node's degree in top-left corner.
* Edges from egocenter are red
* Drag and drop supported

## How to use

**Haven't checked if the tool is against Facebook's terms of service, so use at your own risk!**

1. Create file called **.env** to main directory add fill in correct data according to **.env.template** file (email address, password and facebook username).
2. Start web scraping with command `yarn fetch`.
3. Wait until scraping is finished, it'll take some until script starts logging to console.
4. Start visualization with command `yarn start`.

## Known issues and notes
* Web scraping takes some time, so be patient. There's some delays included just in case.
* People who don't have a facebook username (id is /profile.php?id=something) are excluded as their behaviour is different.
* People who don't have any friends in common are included, but the data is fixed during the parsing phase after scraping, since */friends_mutual* redirects to */friends* if there are no mutual friends.
* Feel free to create a PR for any new features!