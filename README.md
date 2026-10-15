# Texas DPS Mock Test

A free practice test for the Texas Class C driver's license knowledge test. It works on phones, needs no app or sign-in, and has optional Gujarati help.

**Take the test:** (https://milind-av.github.io/Texas-DPS-Mock-Test/)

> ગુજરાતી બોલનારાઓ માટે: Practice મોડમાં ગુજરાતી સ્વિચ ચાલુ કરો, એટલે દરેક પ્રશ્ન, દરેક જવાબ અને સમજૂતી ગુજરાતીમાં પણ દેખાશે. Words ટૅબમાં અમેરિકાના ડ્રાઇવિંગ શબ્દો ગુજરાતીમાં સમજાવ્યા છે.

## What's inside

- **30 questions per test**, drawn from a bank of 277. You need 21 correct (70%) to pass, the same as the real test.
- **All 8 topics** from the Texas test in every set, so each test is balanced:

  | Topic | Questions per test |
  |---|---|
  | Signs, signals and markings | 8 |
  | Right of way | 4 |
  | Speed, passing and following | 4 |
  | Turning and parking | 3 |
  | Alcohol, drugs and impairment | 3 |
  | Licensing, insurance and crashes | 3 |
  | Sharing the road | 3 |
  | Safety and emergencies | 2 |

- **Questions you haven't seen come first**, so repeat tests don't keep showing the same ones.
- **Real-looking sign pictures** wherever the real test would show a sign.
- **Two ways to take it:**
  - **Exam:** a 60-minute countdown in English only, with answers shown at the end, like the real test.
  - **Practice:** no time limit, but a clock counts up. You see the right answer, why each wrong choice is wrong, and a memory trick after every question. Turn on the ગુજરાતી switch to see each question, answer choice and explanation in Gujarati too. It starts off.
- **Memory tricks** for every topic, including speed limits, parking distances, and fines and penalties.
- **Words in Gujarati:** common US driving terms like *right-of-way* and *roundabout*, explained with pictures.
- **Your progress stays on your device.** Your last scores and any unfinished test are saved in your browser.

## Saving scores to a Google Sheet (optional)

When it's turned on, every finished 30-question test adds a row to a Google Sheet, so one person can see everyone's scores. Rounds of "Practice the ones you missed" aren't sent.

The first screen asks **Who's taking the test?** every time the page opens. Nothing else can be used until a name of at least 2 letters is typed. The box is pre-filled with the last name used on that device, so on a shared phone the next person just types over it. The start screen then shows **Taking the test as (name)**, with a **Not you? Change name** link.

The name screen also tells you whether the score sheet is connected. A grey note means it's working. A red **Score sheet isn't connected** note means the address on line 11 is missing or doesn't look right.

If someone is offline, their score waits on their device and is sent the next time they open the test.

### What gets saved

| Column | Example |
|---|---|
| Finished | Oct 15, 2026 2:05 PM |
| Name | The name typed when the test started |
| Mode | Exam or Practice |
| Score, Out of, Percent, Result | 24, 30, 80%, Pass |
| Minutes | 33.1 |
| Ran out of time | Yes or No |
| One column per topic | 7 of 8 |
| Received, Result ID, Device | When it arrived, plus random codes used to skip repeats |

No email addresses, locations, or other personal details are collected. The device code is a random ID that only tells results from different browsers apart.

### Setup

1. **Create the sheet.** Make a new Google Sheet, then go to **Extensions > Apps Script**. Paste in all of `Code.gs` and change `SECRET` to a word of your own. Save.
2. **Allow access.** Pick `setup` in the function list and click **Run**. Allow access when asked. If Google says the app isn't verified, click **Advanced**, then **Go to (your project)**. That warning appears because it's your own script.
3. **Publish the script.** Go to **Deploy > New deployment > Web app**. Set **Execute as: Me** and **Who has access: Anyone**, click **Deploy**, and copy the URL that ends in `/exec`.
4. **Connect the page.** In `index.html`, paste that URL after `SCORES_URL =` on line 11, and your secret word after `SCORES_KEY =` on line 12. Quotes are optional, and curly quotes from a phone keyboard are fine:

   ```
   SCORES_URL = https://script.google.com/macros/s/AKfy.../exec
   SCORES_KEY = your-secret-word
   ```
5. **Test it.** Open the site, type a name, and finish a test. A new row should appear in the **Scores** tab.

To turn the score sheet off, write `SCORES_URL = off`.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole test in one file: questions, pictures, memory tricks, and the Gujarati guide |
| `Code.gs` | A copy of the Google Apps Script. The one that actually runs lives inside your Google Sheet. |
| `README.md` | This page |

## Updating the test

1. Upload the new `index.html` with **Add file > Upload files**. It replaces the old one.
2. Put your `SCORES_URL` and `SCORES_KEY` back on lines 11 and 12.
3. Wait a few minutes for the site to refresh. The footer at the bottom of the page shows the version, for example **Version 1.0.2 · score sheet connected**, so you can tell the new copy is live.

If you change `Code.gs`, go to **Deploy > Manage deployments**, click the pencil icon, choose **Version: New version**, and click **Deploy**. Otherwise Google keeps running the old code. The URL stays the same.

## Troubleshooting

- **The site shows a 404 page.** Wait a few minutes after turning on Pages. Then check that the file is named exactly `index.html` and that **Settings > Pages** is set to the `main` branch and the `/ (root)` folder.
- **The results screen says "Couldn't reach the score sheet."** Check that the URL ends in `/exec`, that **Who has access** is set to **Anyone**, and that the device is online. The score is kept and sent again next time.
- **The results screen says "Saved to the score sheet," but no row appears.** The secret words probably don't match. Google hides its reply from the page, so the page can't tell. Make `SECRET` in the script exactly match `SCORES_KEY` in `index.html`, including capital letters.
- **The site still looks like the old version.** GitHub can take up to about 10 minutes to show a new upload. Check the version in the footer, then refresh the page.
- **To check that the script is running,** open the `/exec` URL in a browser. You should see `"Score collector is running"`.

## Good to know

- Anyone with the link can open this site. The secret word stops random junk from reaching the sheet, but anyone who views the page source can see it. Don't treat the sheet as private from people who have the link.
- The questions are written from the Texas Driver Handbook and the Texas Transportation Code. Laws change, so study the current handbook from [Texas DPS](https://www.dps.texas.gov) too.
- This is an independent practice tool. It is not made by or affiliated with the Texas Department of Public Safety.
