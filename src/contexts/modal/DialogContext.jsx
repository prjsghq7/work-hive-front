import { createContext, useContext, useState } from "react";

import iconInfo from "../../assets/images/modal/icon-info.png";
import iconSuccess from "../../assets/images/modal/icon-success.png";
import iconWarning from "../../assets/images/modal/icon-warning.png";

const ICON_MAP = {
    info: iconInfo,
    success: iconSuccess,
    warning: iconWarning,
};

const DialogContext = createContext(null);

export function DialogProvider({ children }) {
    const [dialog, setDialog] = useState({
        open: false,
        title: "",
        message: "",
        iconKey: null
    });

    const openDialog = (title, message, iconKey = null) => {
        setDialog({
            open: true,
            title,
            message,
            iconKey,
        });
    };

    const closeDialog = () => {
        setDialog((prev) => ({ ...prev, open: false }));
    };

    return (
        <DialogContext.Provider value={{ openDialog }}>
            {children}

            {dialog.open && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            {dialog.iconKey && ICON_MAP[dialog.iconKey] && (
                                <img className="modal-icon" src={ICON_MAP[dialog.iconKey]}  alt="icon"/>
                            )}
                            <h2 className="modal-title">{dialog.title}</h2>
                            <span className="modal-stretch"></span>
                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeDialog}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            {dialog.message}
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="-object-button --blue"
                                onClick={closeDialog}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DialogContext.Provider>
    );
}

export function useDialog() {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog must be used within DialogProvider");
    }
    return context;
}
