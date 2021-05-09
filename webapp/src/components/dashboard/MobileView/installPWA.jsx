import React, {useEffect} from 'react';

const InstallPWA = () => {

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', e => {
            const btn = document.querySelector('#installPWAButton');
            if (window.matchMedia('(display-mode: standalone)').matches) {
                btn.disabled = true;
                btn.innerHTML = 'Already Installed';
                return e.preventDefault();
            } else {
                btn.onclick = _ => e.prompt();
                return e.preventDefault();
            }
        });

    }, []);

    return <div className="p-3 shadow mx-2" style={{ background: '#DFD' }}>
        <h4 className="font-weight-bold">Install Our App</h4>
        <p>
            Never miss an update from us, and access all information
            from your home screen.
        </p>
        <button id="installPWAButton" className="btn btn-primary px-3 py-2 rounded-0">
            Install PWA
        </button>
        <div className="small p-2">
            Only supported on select devices/browsers*
        </div>
    </div>

};

export default InstallPWA;