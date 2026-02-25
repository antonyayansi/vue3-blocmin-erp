
import { jwtVerify } from 'jose';
import { secret } from '@/lib/jwt';

const whiteList = ['/check-boleta'];

const normalizeRoute = (route = '') => {
    if (!route || route === '/') return '/';
    return route.replace(/\/+$/, '') || '/';
};

const parseMenusFromJson = (jsonValue) => {
    if (Array.isArray(jsonValue)) return jsonValue;
    if (Array.isArray(jsonValue?.menus)) return jsonValue.menus;
    return [];
};

const decodeBase64 = (value = '') => {
    try {
        const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
        return atob(padded);
    } catch (_) {
        return '';
    }
};

const extractMenusFromRaw = (rawValue = '') => {
    if (!rawValue) return [];

    try {
        const asJson = JSON.parse(rawValue);
        const menus = parseMenusFromJson(asJson);
        if (menus.length) return menus;
    } catch (_) {}

    const decoded = decodeBase64(rawValue);
    if (decoded) {
        try {
            const decodedJson = JSON.parse(decoded);
            const menus = parseMenusFromJson(decodedJson);
            if (menus.length) return menus;
        } catch (_) {
            const menusIndex = decoded.indexOf('{"menus"');
            if (menusIndex >= 0) {
                try {
                    const payloadJson = JSON.parse(decoded.slice(menusIndex));
                    const menus = parseMenusFromJson(payloadJson);
                    if (menus.length) return menus;
                } catch (_) {}
            }
        }
    }

    return [];
};

const getMenusFromStorage = async () => {
    const blocMenu = localStorage.getItem('bloc-menu');
    if (blocMenu) {
        try {
            const payload = await jwtVerify(blocMenu, secret);
            const verifiedMenus = parseMenusFromJson(payload?.payload);
            if (verifiedMenus.length) return verifiedMenus;
        } catch (_) {}

        if (blocMenu.includes('.')) {
            const parts = blocMenu.split('.');
            if (parts[1]) {
                const jwtPayload = decodeBase64(parts[1]);
                if (jwtPayload) {
                    try {
                        const parsedPayload = JSON.parse(jwtPayload);
                        const payloadMenus = parseMenusFromJson(parsedPayload);
                        if (payloadMenus.length) return payloadMenus;
                    } catch (_) {}
                }
            }
        }

        const extractedMenus = extractMenusFromRaw(blocMenu);
        if (extractedMenus.length) return extractedMenus;
    }

    const legacyMenus = localStorage.getItem('ta-menus');
    if (legacyMenus && legacyMenus !== 'W10=') {
        const extractedLegacyMenus = extractMenusFromRaw(legacyMenus);
        if (extractedLegacyMenus.length) return extractedLegacyMenus;
    }

    return [];
};

const findRouteInMenus = (menusList = [], targetRoute = '/') => {
    const normalizedTargetRoute = normalizeRoute(targetRoute);

    for (const menu of menusList) {
        const menuValue = menu?._custom?.value || menu || {};
        const currentRoute = menuValue.ruta || menuValue.url || '';
        const normalizedCurrentRoute = normalizeRoute(currentRoute);

        if (normalizedCurrentRoute === normalizedTargetRoute) {
            return true;
        }

        if (
            normalizedCurrentRoute &&
            normalizedCurrentRoute !== '/' &&
            normalizedCurrentRoute !== '#' &&
            normalizedCurrentRoute !== '*' &&
            normalizedTargetRoute.startsWith(`${normalizedCurrentRoute}/`)
        ) {
            return true;
        }

        if (Array.isArray(menuValue.children) && menuValue.children.length > 0) {
            if (findRouteInMenus(menuValue.children, normalizedTargetRoute)) {
                return true;
            }
        }
    }

    return false;
};

const isPermission = async (to, from, next) => {
    const targetRoute = normalizeRoute(to.path);

    if (whiteList.includes(targetRoute)) {
        next();
        return;
    }

    const menus = await getMenusFromStorage();
    const hasPermission = findRouteInMenus(menus, targetRoute);

    if (!hasPermission && targetRoute !== '/') {
        next('/');
        return;
    }

    next();
};

export default isPermission;