# Smart Sticky Notes

Smart Sticky Notes is a lightweight Chrome extension that lets you create floating sticky notes for specific webpages. Whether you need to jot down quick reminders, summarize articles, or temporarily bookmark pages, this extension helps you stay organized without cluttering your browser.

## ✨ Features
- **Webpage-Specific Notes** – Attach notes to any webpage and access them later.
- **Persistent Access** – Even if you close a page, retrieve your notes via the new tab page.
- **Multiple Notes per Page** – Create multiple sticky notes for a single webpage.
- **Customizable** – Change note colors and reposition them as needed.
- **Browser Local Storage** – Notes are stored locally, ensuring privacy.

## 🛠️ Tech Stack
- **React** – Frontend UI
- **Tailwind CSS** – Styling
- **Browser Local Storage** – Data persistence

## 📦 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/smart-sticky-notes.git
   cd SkyNotes
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load the extension in Chrome:
   - Open `chrome://extensions/`.
   - Enable "Developer mode" (top right corner).
   - Click "Load unpacked" and select the `dist` folder.

## 🚀 Usage
1. Open any webpage.
2. Click the **Smart Sticky Notes** extension icon.
3. Type a note and save it – it will appear as a floating sticky note.
4. Access your notes anytime from the new tab page.
5. Click the link icon on a note to reopen the associated webpage.

## 🔒 Permissions Justification
- **activeTab**: Required to add notes to the currently open webpage.
- **tabs**: Needed to manage saved notes and allow reopening of webpages from the new tab page.

## 🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.
---
⭐ **Star this repo if you find it useful!** 🚀

