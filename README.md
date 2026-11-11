# Hajira's Pink Luxury Birthday Experience

A no-photo birthday surprise website with a pink-and-gold theme, animated welcome,
a heartfelt birthday letter, six message sections, an editable birthday countdown,
a surprise gift reveal, gentle original browser-generated celebration audio,
fireworks, and a guestbook.

## Run on Windows

1. Install Python 3.10 or newer from https://www.python.org/downloads/
   (tick **Add Python to PATH** during installation).
2. Extract this ZIP file.
3. Open the extracted `hajira_birthday_website` folder.
4. In the folder address bar, type `cmd` and press Enter.
5. Run:

   ```bash
   py -m venv .venv
   .venv\Scripts\activate
   py -m pip install -r requirements.txt
   py app.py
   ```

6. Open http://127.0.0.1:5000 in Chrome.

If `py` is not recognized, use `python` in its place.

## Set the birthday date

On the page, use the birthday date field and press **Save date**.
The countdown updates automatically. The date is saved in that browser.

## Guestbook

Guestbook wishes are saved in `wishes.json` on the computer running the site.
Keep the terminal window open while the website is being used.

## Publish online

This project is a Flask app, so it needs a Python-capable host (for example Render).
Do not upload it as a plain static site. See https://render.com/docs/deploy-flask.

This project contains no photo gallery, photo dashboard, or personal photos.
