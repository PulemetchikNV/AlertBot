=====Setting up NodeJS environment=====
1. install nodejs on your server if it's not
2. run "npm i"

=====Setting up DB=====
1. Create database AlertBot
2. Change db data in /config/init.json
3. Change directory to AlertBot\database
4. run "db-migrate up init --config ./config/init.json"

Migration is made

=====Setting up bot=====
1. Set tgtoken & port in config.js.dist
2. Change database data in conn.js.dist
3. Remove .dist ending from both files
4. Use & enjoy your bot
