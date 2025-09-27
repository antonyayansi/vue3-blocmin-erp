<template>
    <div class="text-center font-light text-sm text-gray-500 dark:text-gray-400 mt-4">
        © Blocmin ERP {{ version }}
    <div class="text-center font-light text-xs text-gray-500 mt-2">
        <p>Soporte: 936856095</p>
        <button @click="openAnyDesk"
            class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            <i class="pi pi-desktop"></i> Abrir AnyDesk
        </button>
    </div>
    </div>
</template>

<script setup>
import { version } from '../../../services/baseApi';

function getMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        return 'Android';
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS';
    } else {
        return 'Unknown';
    }
}

const openAnyDesk = () => {

    const mobileOS = getMobileOperatingSystem();

    if (mobileOS === 'Unknown') {
        window.location.href = 'anydesk://';
        setTimeout(function () {
            window.location.href = 'https://siadeg.com/download/AnyDesk.exe';
        }, 500);
    } else if (mobileOS === 'Android') {
        window.open('https://play.google.com/store/apps/details?id=com.anydesk.anydeskandroid', '_blank');

    } else if (mobileOS === 'iOS') {
        window.open('https://apps.apple.com/us/app/anydesk-remote-desktop/id1176131273', '_blank');
    }
}

</script>