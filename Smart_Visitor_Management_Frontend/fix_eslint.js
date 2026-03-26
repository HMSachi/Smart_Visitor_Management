const fs = require('fs');

const unneeded = {
  'src/components/Admin/Dashboard/Security/BlacklistTable.js': ['ShieldAlert', 'MoreVertical'],
  'src/components/Contact_Person/Approved/ApprovedTable.js': ['Eye'],
  'src/components/Contact_Person/History/HistoryTable.js': ['Download', 'Filter', 'Search', 'Calendar'],
  'src/components/Contact_Person/Layout/Sidebar.js': ['XCircle', 'History'],
  'src/components/Contact_Person/Notifications/NotificationList.js': ['Bell'],
  'src/components/Contact_Person/Profile/ProfileForm.js': ['Shield'],
  'src/components/Contact_Person/Rejected/RejectionAlertPanel.js': ['AnimatePresence'],
  'src/components/Contact_Person/Rejected/RejectionTable.js': ['ShieldAlert'],
  'src/components/Contact_Person/Status/SentTable.js': ['Clock', 'ChevronRight'],
  'src/components/Security_Officer/EntryApproval/ApprovalChecklist.js': ['ShieldCheck'],
  'src/layout/Contact_Person/Notifications/Notifications.js': ['Settings2'],
  'src/layout/Contact_Person/VisitorHistory/VisitorHistory.js': ['Calendar'],
  'src/layout/Login/LoginPage.js': ['ShieldCheck', 'Mail', 'Eye', 'EyeOff', 'Loader2', 'AlertCircle'],
  'src/layout/Security_Officer/ActiveVisitors/ActiveVisitors.js': ['MapPin'],
  'src/layout/Security_Officer/ExitVerification/ExitVerification.js': ['X'],
  'src/layout/Security_Officer/IncidentReport/IncidentReport.js': ['Trash2', 'ShieldAlert'],
};

for (const [file, words] of Object.entries(unneeded)) {
  const p = `e:/DTS/Visitor_Managment/Smart_Visitor_Management/Smart_Visitor_Management_Frontend/${file}`;
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    let lines = content.split('\n');
    for (let i = 0; i < 20; i++) {
        if (lines[i] && lines[i].includes('import')) {
            words.forEach(word => {
                let re1 = new RegExp(`\\b${word}\\b\\s*,`, 'g');
                let re2 = new RegExp(`,\\s*\\b${word}\\b`, 'g');
                let re3 = new RegExp(`\\b${word}\\b`, 'g');
                
                lines[i] = lines[i].replace(re1, '');
                lines[i] = lines[i].replace(re2, '');
                lines[i] = lines[i].replace(re3, '');
            });
            
            // Clean up empty imports like `import { } from 'lucide-react'`
            if (lines[i].match(/import\s*{\s*}\s*from/)) {
                lines[i] = null;
            }
        }
    }
    // Filter out null lines
    lines = lines.filter(l => l !== null);
    content = lines.join('\n');
    fs.writeFileSync(p, content);
  }
}

// Special case for VisitorHistory.js searchTerm assignment
const vhp = 'e:/DTS/Visitor_Managment/Smart_Visitor_Management/Smart_Visitor_Management_Frontend/src/layout/Contact_Person/VisitorHistory/VisitorHistory.js';
if (fs.existsSync(vhp)) {
  let vh = fs.readFileSync(vhp, 'utf8');
  vh = vh.replace(/const\s+\[searchTerm,\s*setSearchTerm\]\s*=\s*useState[^;]+;/g, '');
  // Because it leaves a blank or empty line, that's fine
  fs.writeFileSync(vhp, vh);
}

console.log("ESLint warnings fixed");
