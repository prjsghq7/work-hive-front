import { useEffect, useState } from "react";
import { permissionService } from "../../services/user/userService.js";

export function usePermission() {
    // null | "ADMIN" | "USER" | "NOT_LOGIN" | "UNKNOWN" | "ERROR"
    const [permission, setPermission] = useState(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            const p = await permissionService.getPermission();
            if (mounted) setPermission(p);
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return permission;
}

export function useIsAdmin() {
    const permission = usePermission();
    return permission === null ? null : permission === "ADMIN";
}
