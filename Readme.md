Aagman Gate Pass System

Aagman is a digital gate pass management system designed to replace the traditional paper-based gate pass process used in institutes.  
Students can request different types of gate passes, which are then approved by the respective authorities and verified at the institute gate using QR codes.

Features

User Authentication
- Separate login system for students, department authorities, hostel office, and gate authorities
- Role-based access control for different users

Gate Pass Requests
- Students can apply for multiple types of gate passes
- Out-of-station pass
- Local pass
- Short duration / tea-coffee pass

Approval Workflow
- Out-of-station passes are approved by the department
- Local passes are approved by the hostel office
- Pass status updates after approval or rejection

QR Code Based Verification
- QR code is generated automatically after pass approval
- QR code contains pass information
- Gate authorities scan the QR code to verify the pass

One-Time Pass Usage
- Once a QR code is scanned at the gate, the pass is marked as used
- Prevents reuse of the same pass

Real-Time Gate Verification
- Gate login dashboard for scanning and validating passes
- Pass details are shown instantly after scanning

Student Dashboard
- Students can submit gate pass requests
- View pass status (pending / approved / rejected)
- Access generated QR codes

Secure Backend APIs
- REST APIs built with Node.js and Express
- Handles pass creation, approval, verification, and user authentication

Tech Stack

Frontend
- React.js
- HTML
- CSS
- Tailwind CSS
- Vite

Backend
- Node.js
- Express.js

Database
- MongoDB

Libraries / Tools
- Axios
- html5-qrcode
- qrcode.react
- Git
- GitHub

Workflow

1. Student logs in and submits a gate pass request
2. Request is sent to the respective authority for approval
3. After approval, a QR code is generated
4. Student shows the QR code at the gate
5. Gate authority scans the QR code
6. Pass is verified and marked as used

Installation

Clone the repository

```
git clone https://github.com/vedantsingh72/backend_aagman2.git
```

Move into the project folder

```
cd backend_aagman2
```

Install dependencies

```
npm install
```

Start the server

```
npm start
```

Author

Vedant Singh  
B.Tech Computer Science and Engineering  
Rajiv Gandhi Institute of Petroleum Technology