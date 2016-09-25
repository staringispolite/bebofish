This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# Bebofish - Universal Live Translation for Bebo chat

![Image of translation in action](http://i.imgur.com/QGEQ80h.jpg)

### to run a dev Bebofish chat room locally

#### Google Translate
1. Get your own Google Translate API key. [Their trial is $300 free for 60 days.](https://cloud.google.com/translate/)
2. Replace my (now stale) API key with yours [here](https://github.com/staringispolite/bebofish/blob/master/src/js/components/chat-list.jsx#L161)

#### Run a dev server for your 'room'
1. clone this repo
2. `npm install` (if you don't have npm => `brew install node` on mac)
3. `npm start`
4. check you've got the 'four dots' loading screen at `http://localhost:3000` on a browser

#### Add the room to your Bebo group
1. Download the Bebo app
2. Make sure your phone's on the same wifi network as your laptop
3. Open your group (or make a new one!)
4. Click the gears icon, then 'Add Room'
5. Enter `http://{your local IP}:3000` (not your public internet IP. find this using ifconfig)
6. Chat like normal, in any language

### to build production version

1. Clone
2. `npm install`
3. `npm run build`
