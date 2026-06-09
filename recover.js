const fs = require('fs');
const path = require('path');
const os = require('os');

const historyDir = path.join(os.homedir(), 'AppData', 'Roaming', 'Code', 'User', 'History');
const targetProjectDir = 'c:\\Users\\User\\Desktop\\rbac-social-platform';

const isTargetResource = (resourceUri) => {
    try {
        const decodedUri = decodeURIComponent(resourceUri);
        // VS Code URIs might look like file:///c%3A/Users/User/Desktop/...
        return decodedUri.toLowerCase().includes('rbac-social-platform') && !decodedUri.includes('node_modules') && !decodedUri.includes('.next');
    } catch (e) {
        return false;
    }
};

const getRelativePath = (resourceUri) => {
    const decodedUri = decodeURIComponent(resourceUri);
    // Find the portion after 'rbac-social-platform'
    const match = decodedUri.match(/rbac-social-platform[\\\/](.+)$/i);
    if (match && match[1]) {
        return match[1];
    }
    return null;
};

async function recoverFiles() {
    console.log('Scanning VS Code history...');
    if (!fs.existsSync(historyDir)) {
        console.error('History directory not found:', historyDir);
        return;
    }

    const hashDirs = fs.readdirSync(historyDir);
    let recoveredCount = 0;

    for (const dir of hashDirs) {
        const dirPath = path.join(historyDir, dir);
        if (!fs.statSync(dirPath).isDirectory()) continue;

        const entriesFile = path.join(dirPath, 'entries.json');
        if (!fs.existsSync(entriesFile)) continue;

        try {
            const data = JSON.parse(fs.readFileSync(entriesFile, 'utf8'));
            if (data.resource && isTargetResource(data.resource)) {
                const relPath = getRelativePath(data.resource);
                if (!relPath) continue;

                // Sort entries by timestamp descending
                if (data.entries && data.entries.length > 0) {
                    data.entries.sort((a, b) => b.timestamp - a.timestamp);
                    const latestEntry = data.entries[0];
                    const backupFilePath = path.join(dirPath, latestEntry.id);

                    if (fs.existsSync(backupFilePath)) {
                        const targetFilePath = path.join(targetProjectDir, relPath);
                        
                        // Create parent directories if they don't exist
                        const targetDir = path.dirname(targetFilePath);
                        if (!fs.existsSync(targetDir)) {
                            fs.mkdirSync(targetDir, { recursive: true });
                        }

                        // Copy the file
                        fs.copyFileSync(backupFilePath, targetFilePath);
                        console.log(`Recovered: ${relPath}`);
                        recoveredCount++;
                    }
                }
            }
        } catch (err) {
            // Ignore parse errors for individual files
        }
    }
    
    console.log(`\nRecovery complete! Restored ${recoveredCount} files.`);
}

recoverFiles();
