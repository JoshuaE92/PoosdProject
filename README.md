# COLORS – LAMP Stack Demo (COP 4331)

COLORS is a small web application built for the COP 4331 (Processes of Object-Oriented Software Development) LAMP lab at UCF. A user logs in, then can **add** color names to a personal list and **search** that list. Each user only sees their own colors.

The app is a simple example of a full LAMP stack: an HTML/CSS/JavaScript front end sends JSON to PHP API endpoints, and those endpoints read and write a MySQL database.

## Technologies Used

| Layer     | Technology                                   |
|-----------|----------------------------------------------|
| OS        | Linux (Ubuntu on a DigitalOcean droplet)     |
| Web server| Apache                                       |
| Database  | MySQL                                        |
| Backend   | PHP (`mysqli` with prepared statements)      |
| Frontend  | HTML, CSS, vanilla JavaScript (`XMLHttpRequest`) |
| Other     | [blueimp JavaScript-MD5](https://github.com/blueimp/JavaScript-MD5), Google Fonts (Ubuntu) |

## Repository Structure

```
PoosdProject/
  |---- api/                   PHP API endpoints (deployed as /LAMPAPI on the server)
  |     |-- Login.php          POST {login, password}        -> {id, firstName, lastName, error}
  |     |-- AddColor.php       POST {color, userId}          -> {error}
  |     |-- SearchColors.php   POST {search, userId}         -> {results: [...], error}
  |     |-- config.sample.php  Template for DB credentials (copy to config.php)
  |---- db/
  |     |-- schema.sql         Creates the COP4331 database and its tables
  |---- public/                Static front end (deployed to the web root)
  |     |-- index.html         Login page
  |     |-- color.html         Add/search colors page (after login)
  |     |-- css/styles.css
  |     |-- js/code.js         Front-end logic and API calls
  |     |-- js/md5.js
  |     |-- images/
  |---- README.md
  |---- LICENSE.md
  |---- .gitignore
```

## How It Works

1. `index.html` collects a username and password. `code.js` POSTs them as JSON to `LAMPAPI/Login.php`.
2. `Login.php` looks the user up in the `Users` table and returns their ID and name.
3. On success, `code.js` saves the user's info in a cookie (valid for 20 minutes) and redirects to `color.html`.
4. On `color.html`, **Add Color** calls `AddColor.php`, which inserts a row into `Colors`. **Search Color** calls `SearchColors.php`, which returns every color for that user whose name contains the search text.

## Setup Instructions

These steps assume a fresh Ubuntu server, such as a DigitalOcean droplet.

1. **Install the LAMP stack**
   ```bash
   sudo apt update
   sudo apt install apache2 mysql-server php libapache2-mod-php php-mysql
   ```

2. **Create the database and tables**
   ```bash
   sudo mysql < db/schema.sql
   ```

3. **Create a MySQL user for the app** (choose your own username and password)
   ```sql
   CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'your_db_password';
   GRANT ALL PRIVILEGES ON COP4331.* TO 'your_db_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Add at least one user to log in with**
   ```sql
   USE COP4331;
   INSERT INTO Users (FirstName, LastName, Login, Password)
   VALUES ('Test', 'User', 'testuser', 'testpass');
   ```

5. **Deploy the files**
   ```bash
   sudo cp -r public/* /var/www/html/
   sudo mkdir -p /var/www/html/LAMPAPI
   sudo cp api/*.php /var/www/html/LAMPAPI/
   ```

6. **Configure the database credentials**
   ```bash
   cd /var/www/html/LAMPAPI
   sudo cp config.sample.php config.php
   sudo nano config.php   # fill in DB_USER and DB_PASS from step 3
   ```
   `config.php` is in `.gitignore`, so real credentials never get into the repository.

7. **Point the front end at your server.** At the top of `public/js/code.js`, `urlBase` is set to `http://poosdlab.me/LAMPAPI`. If you deploy under a different domain or IP, change it to `http://<your-domain-or-ip>/LAMPAPI`.

## Running and Accessing the Application

- Once deployed, Apache serves the app. Open **http://poosdlab.me** (or your own domain/IP) in a browser.
- Log in with a user from the `Users` table.
- Use the text boxes to add colors and search your list. **Log Out** clears the session cookie.

You can also test the API directly:
```bash
curl -X POST http://poosdlab.me/LAMPAPI/Login.php \
     -H "Content-Type: application/json" \
     -d '{"login":"testuser","password":"testpass"}'
```

## Assumptions and Limitations

- **Lab demo, not production code.** The app shows how LAMP components connect. It is not meant to be secure or feature-complete.
- **Passwords are stored and compared in plain text.** The front end includes MD5 hashing, but it is commented out in `code.js`. Even when enabled, MD5 is not a secure password hash; a real app should use `password_hash()` / `password_verify()`.
- **No registration page.** Users must be inserted into the database by hand.
- **HTTP only.** No TLS is configured, so credentials travel unencrypted.
- **The session is a plain cookie** holding the user ID. It isn't signed, so a client could edit it.
- **JSON responses are built by string concatenation**, so values containing quotes can produce invalid JSON.
- Colors cannot be edited or deleted, only added and searched.

## AI Usage

In line with class policy: the application code comes from the COP 4331 LAMP lab and was deployed without AI assistance. An AI assistant (Claude) was used only to help draft this README and to move the hard-coded database credentials into an ignored config file. I reviewed all of it.

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md).
