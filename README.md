VAULT.PRO | Secure Media Storage
VAULT.PRO is a sleek, privacy-focused web application designed to store and categorize personal images locally within a browser. It features a PIN-protected entry system and a metadata-driven upload processor.

🚀 Features
Secure Access: Entry is restricted via a 8-digit PIN pad interface.

Metadata Tagging: Organize images by location, person, and category (Personal vs. Group) during the upload process.

Local Encryption Simulation: Photos are converted to Base64 strings using the FileReader API for local browser storage.

Responsive Dashboard: A modern, dark-themed grid layout built with Tailwind CSS for viewing stored media.

Session Management: Uses sessionStorage to maintain authentication and a "Lock Vault" feature to immediately secure data.

🛠️ Tech Stack
Frontend: HTML5, Tailwind CSS.

Animations: Animate.css.

Logic: Vanilla JavaScript (ES6+).

Storage: Browser localStorage for persistent data and sessionStorage for auth states.

📂 Project Structure
Bash
├── index.html       # PIN-entry login page
├── dashboard.html   # Main media explorer grid
├── upload.html      # Image processor and metadata form
├── css/
│   └── main.css     # Custom glassmorphism styles
└── js/
    └── vault-logic.js # logic for rendering stored media
⚙️ Setup & Usage
Clone the Repository:

Bash
git clone https://github.com/your-username/vault-pro.git
Launch: Open index.html in any modern web browser.

Authentication:

Default PIN: 00110011.

Click OK to enter the dashboard.

Uploading:

Click UPLOAD FILE on the dashboard.

Enter details (Place, Person, Category) and select your image files.

Click Process to Vault to save.

🛡️ Privacy Note
This application utilizes Local Storage. No data is sent to a server; all images and information remain strictly on your local machine. Clearing your browser's site data will remove all vaulted items.
