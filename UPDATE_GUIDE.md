# DelighteDev website update guide

This guide is only for you. It is not a page on the website.

The project folder is the folder containing this guide, `package.json`, and the `src` folder.

A terminal is a small window where you type commands. On Windows, you can right-click the project folder and choose **Open in Terminal**. You can also open the folder in VS Code and choose **Terminal > New Terminal**.

## A. Run the website on your computer

1. Make sure Node.js is installed. You already have it if `node --version` shows a version number.
2. Open a terminal in the project folder.
3. The first time only, run:

   ```sh
   npm install
   ```

   This collects the small building blocks the website needs.

4. Run:

   ```sh
   npm run dev
   ```

5. The terminal will show a local address, normally `http://localhost:5173`. Open that address in your browser. This copy is only on your computer.
6. Keep the terminal open while you look at the site. When you change and save a project file, the browser normally updates by itself.
7. To stop the local website, click the terminal and press **Ctrl + C**.
8. Before publishing, you can check the finished version by running:

   ```sh
   npm run build
   ```

   If it finishes without a red error, the website has built successfully. The finished files go into the `dist` folder. Do not edit that folder because it is created again each time.

## B. Save to GitHub and publish on Netlify

### First time: put the project on GitHub

1. Open a terminal in the project folder and run `git --version`.
2. If Git is not installed, download it from `https://git-scm.com/downloads`, install it with the normal choices, then close and reopen the terminal.
3. On GitHub, open `https://github.com/new`.
4. Give the repository a name such as `delightedev-website`. A repository is the online home for the project.
5. Choose Public or Private. Do not add a README, `.gitignore`, or licence because the project already has its files.
6. Choose **Create repository**. Keep the page open.
7. In the project terminal, run these commands one at a time:

   ```sh
   git init
   git add .
   git commit -m "Build DelighteDev personal website"
   git branch -M main
   ```

8. If Git asks who you are, run these two commands with your own details, then repeat the commit command:

   ```sh
   git config --global user.name "YOUR GITHUB USERNAME"
   git config --global user.email "YOUR EMAIL"
   ```

9. GitHub will show a command containing your repository address. It will look like this, with your username filled in:

   ```sh
   git remote add origin https://github.com/YOUR-USERNAME/delightedev-website.git
   ```

10. Push means send a copy to GitHub. Run:

    ```sh
    git push -u origin main
    ```

11. Refresh the GitHub repository page. You should see the project files.

### First time: publish with Netlify

1. Open `https://app.netlify.com` and sign up or log in with GitHub.
2. Choose **Add new project**, then **Import an existing project**. Older screens may say **Add new site > Import an existing project**.
3. Choose **GitHub** and allow Netlify to see the repository when asked.
4. Choose `delightedev-website`.
5. The included `netlify.toml` file should fill in the settings. Check that the build command is `npm run build` and the publish folder is `dist`.
6. Choose **Deploy**. Netlify will build the site and give you an address ending in `.netlify.app`.
7. Open that address and check the home page, a direct visit to `/interests`, and a direct visit to `/clicks`.
8. You can change the temporary Netlify name under the site's **Site configuration > Site details > Change site name**.

### Publish later changes

1. Save your changes and check them locally with `npm run dev`.
2. Run `npm run build` to catch mistakes.
3. In the project terminal, run:

   ```sh
   git add .
   git commit -m "Describe your change here"
   git push
   ```

4. Netlify sees the new copy on GitHub and updates the published site automatically.
5. In Netlify, open **Deploys** if you want to watch progress. Wait until the newest deploy says **Published**.

## C. Connect delightedev.com from Squarespace to Netlify

These steps keep the domain registered at Squarespace. DNS records are the internet's directions for finding your website. You only need to change the website directions described below.

1. Finish the Netlify setup above and copy your real Netlify address, such as `delightedev.netlify.app`.
2. In the Netlify project, choose **Domain management** in the left menu.
3. Choose **Add a domain** or **Add custom domain**, enter `delightedev.com`, and confirm that you own it.
4. Netlify should add both `delightedev.com` and `www.delightedev.com`. If Netlify shows personalised DNS directions, follow those values instead of guessing.
5. In another tab, log into Squarespace and open `https://account.squarespace.com/domains`.
6. Click **delightedev.com**, then click **DNS**, then **DNS settings**.
7. Make sure the domain uses Squarespace nameservers for this method. You do not need to move the domain or change its nameservers.
8. Find **Squarespace Defaults**. Remove the default website records so the domain no longer points to a Squarespace website. Squarespace may show one trash button for this group. These defaults can be added again later if needed.
9. Do not remove MX or other mail records. Those control email.
10. Scroll to **Custom Records** and choose **Add Record**.
11. Choose type **A**. In **Name**, enter `@`. In **IP Address**, enter `75.2.60.5`. Save.
12. Add another record. Choose type **CNAME**. In **Name**, enter `www`. In **Data**, enter your real Netlify address, such as `delightedev.netlify.app`. Do not add `https://` or a trailing slash. Save.
13. Return to **Netlify > Domain management**. Wait for the domain checks to succeed.
14. Netlify will also set up HTTPS, the secure padlock version of the site. If asked, choose the option to provision or renew the HTTPS certificate.
15. In Netlify's domain options, make `delightedev.com` the primary domain if it is not already. The `www` address can then send people to the main address.
16. Wait. Domain changes can start working in minutes, but sometimes take several hours or up to 24–48 hours. HTTPS can also take a little while after the domain connects.
17. Test `https://delightedev.com` and `https://www.delightedev.com` in a private browser window.

## D. Create the Blogspot blog and change its address

### Create the blog

1. Open `https://www.blogger.com` and sign in with the Google account you want to use.
2. Choose **Create blog** or **New blog**.
3. Enter the blog title and choose a Blogspot address. For example, use `delightedev-blog.blogspot.com` if it is available. If it is taken, choose another address you like.
4. Choose a theme and finish creating the blog.
5. Copy the complete blog address, including `https://`.

### Change the one website setting

1. Open `src/data/site.js`.
2. Find this line:

   ```js
   export const BLOG_URL = "https://delightedev-blog.blogspot.com";
   ```

3. Replace only the address between the quotation marks with your real Blogspot address.
4. Save the file and publish with the GitHub steps in section B.
5. The build creates the Netlify redirect from this setting. You do not need to edit a second redirect file.
6. Test `https://delightedev.com/blog`. It should immediately open the real blog.

### Optional later: use blog.delightedev.com

1. In Blogger, go to **Settings > Publishing > Custom domain**.
2. Enter `blog.delightedev.com` and save. Blogger will show the DNS records it needs.
3. Blogger normally asks for a CNAME named `blog` pointing to `ghs.google.com`, plus a second security CNAME with values unique to your blog.
4. Add both records where your domain DNS is managed. If you followed section C, that is **Squarespace > Domains > delightedev.com > DNS > DNS settings > Custom Records > Add Record**.
5. Return to Blogger and finish the custom domain setup.
6. After it connects, turn on **HTTPS availability** and **HTTPS redirect** in Blogger's HTTPS settings.
7. Change `BLOG_URL` in `src/data/site.js` to `https://blog.delightedev.com` and publish. Your `/blog` link will then send people to that address.

## E. Copy-paste follow-up prompts for the AI

Replace the blanks and examples with your own details. You can give these prompts to the AI instead of editing files yourself.

### Home: splash texts

```text
Please edit src/data/home.js. Add the splash text "ADD THIS EXACT TEXT" and remove "REMOVE THIS EXACT TEXT". Keep the other splash texts unchanged and do not add any extra wording to the page.
```

### Home: About text

```text
Please replace the About paragraph that begins "BEGINNING OF OLD PARAGRAPH" with this exact text: "PASTE THE NEW PARAGRAPH HERE". Keep the Thought paragraph as a click-to-reveal spoiler and do not invent any additional text.
```

### Home: social links and email

```text
Please update my social details in src/data/home.js. Change PLATFORM NAME to THIS NEW LINK OR USERNAME. Keep Discord as text with a copy button and do not add any other social platforms.
```

```text
Please change my displayed email address in src/data/home.js to NEW EMAIL ADDRESS. Keep the email link, copy email button, and Copied confirmation working.
```

### Home: introduction

```text
Please update src/data/home.js. Change my age to NEW AGE and my degree line to "NEW EXACT DEGREE LINE". Keep the yearly-update comment next to my age and keep the long line tidy on a 360px screen.
```

### What I Like: add a game or show

```text
I have put an image named FILE NAME in public/images/interests. Please add GAME OR SHOW NAME to the correct list in src/data/interests.js, using /images/interests/FILE NAME as its image. Do not change the other entries.
```

### What I Like: replace a name tile or image

```text
I have put NEW FILE NAME in public/images/interests. Please replace the image for EXACT GAME OR SHOW NAME in src/data/interests.js with /images/interests/NEW FILE NAME. Check that it loads and keep the name visible below it.
```

### What I Like: setup

```text
Please update my setup in src/data/interests.js. Change PART NAME to "NEW EXACT VALUE". Leave every other setup line unchanged.
```

### What I Like: current obsession

```text
Please change my current game obsession to GAME NAME in src/data/interests.js. I have placed its image at public/images/interests/FILE NAME. Move or replace only the current obsession entry and preserve the rest of the page.
```

### Clicks: prepare and add a photo

1. Put the image file in `public/images/clicks`. JPG, PNG, or WebP files work. Use a simple name such as `rainy-delhi-01.jpg`.
2. Use this prompt:

```text
I have put FILE NAME in public/images/clicks. Please add it to src/data/photos.js with id "UNIQUE ID", src "/images/clicks/FILE NAME", alt "SHORT DESCRIPTION", title "TITLE", place "PLACE", date "DATE", and camera "CAMERA". Leave any unwanted caption lines empty. Keep lazy loading and the lightbox working.
```

### Clicks: replace a placeholder

```text
I have put FILE NAME in public/images/clicks. Please replace placeholder ENTRY ID in src/data/photos.js with this real photo. Use src "/images/clicks/FILE NAME", alt "SHORT DESCRIPTION", and these captions: title "TITLE", place "PLACE", date "DATE", camera "CAMERA". Remove any empty caption lines from the display without deleting the other photos.
```

### Clicks: remove or reorder

```text
Please edit only src/data/photos.js. Remove ENTRY ID and move SECOND ENTRY ID so it appears immediately after THIRD ENTRY ID. Do not delete any image files and keep 20 placeholders only if the list still needs them.
```

### Blog

```text
Please change only BLOG_URL in src/data/site.js to "NEW COMPLETE BLOGSPOT ADDRESS". Rebuild and confirm that the generated Netlify /blog redirect and the inside-site fallback use the new address.
```

### Minecraft Server

```text
Please update src/data/minecraft.js. Change the server IP to "NEW IP", version to "NEW VERSION", map link to "NEW MAP LINK", and description to "NEW EXACT DESCRIPTION". Keep the copy button and new-tab map link working, and do not add rules, Discord, or a player counter.
```

### Training Data

```text
Please replace the Training Data page with this exact content: "PASTE MY CONTENT HERE". Use the existing cozy style and do not invent extra headings or paragraphs. Keep the menu and footer unchanged.
```

### Design

```text
Please update src/styles.css to use these muted colours: BACKGROUND COLOUR, GREEN ACCENT, and PURPLE ACCENT. Check text contrast in both dark and light modes and do not add glow, glass effects, or bright neon colours.
```

```text
Please change the heading font to FONT NAME and the body font to FONT NAME. Install or bundle the fonts locally, keep them readable on phones, and remove unused font imports.
```

```text
Please change the first-visit default for the visual rain effect to ON OR OFF. Keep the visitor's saved choice working, respect reduced-motion settings, and leave the rain sound as a separate setting.
```

## F. If something looks wrong

1. **A command is not recognised:** Close and reopen the terminal. Check that Node.js or Git is installed. Make sure the terminal is open in the project folder.
2. **The site will not start:** Run `npm install` once, then try `npm run dev` again.
3. **The page is blank or the build fails:** Run `npm run build`. Copy the complete error and ask the AI to fix it.
4. **An image does not appear:** Check that it is inside the right `public/images` folder. Check capital letters and spelling exactly; `Photo.jpg` and `photo.jpg` are different online. Image addresses in the data files start with `/images/`, not `/public/images/`.
5. **A change is not visible:** Save the file, then hard-refresh with **Ctrl + F5**. Online, check that you ran `git push` and that Netlify's latest deploy says **Published**.
6. **A direct Netlify page gives Not Found:** Check that the site was built with `npm run build` and published from `dist`. The build should create `dist/_redirects`. If it is missing, ask the AI to check `vite.config.js`.
7. **The Blog page still opens the dummy blog:** Change `BLOG_URL` in `src/data/site.js`, push the change, and wait for Netlify to publish it.
8. **Rain or sound will not start:** Open the menu and check the separate toggles. Sound starts only after you tap its control. A device set to reduce motion keeps the visual rain off.
9. **The theme looks different after a reload:** The site remembers your last theme choice. Open the menu and use **Theme: dark** or **Theme: light** to change it.
10. **The domain is not working yet:** Wait several hours before changing records again. Recheck the A and CNAME values in section C and Netlify's domain status.
11. **You are stuck:** Ask the AI for help. Say which page or step failed, paste the exact error, and mention what you clicked. Do not share passwords, access tokens, or other private details.
