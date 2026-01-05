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
        iconKey: null,

        buttons: null, // null이면 기본 확인 버튼 1개
        onClose: null,
    });

    const openDialog = (title, message, iconKey = null) => {
        setDialog({
            open: true,
            title,
            message,
            iconKey,

            buttons: null,
            onClose: null,
        });
    };

    const closeDialog = () => {
        setDialog((prev) => ({ ...prev, open: false }));
    };

    const openDialogEx = (title, message, iconKey = null, options = {}) => {
        const { buttons = null } = options;

        setDialog({
            open: true,
            title,
            message,
            iconKey,
            buttons
        });
    };

    const renderButtons = () => {
        // 기존 dialog: 확인 버튼 1개
        if (!dialog.buttons || dialog.buttons.length === 0) {
            return (
                <button
                    type="button"
                    className="-button --blue"
                    onClick={closeDialog}
                >
                    확인
                </button>
            );
        }

        // 커스텀 버튼: 무조건 닫고 callback 실행
        return dialog.buttons.map((btn, idx) => (
            <button
                key={idx}
                type="button"
                className={`-button --${btn.color ?? "blue"}`}
                onClick={() => {
                    closeDialog();
                    btn.onClick?.();
                }}
            >
                {btn.text}
            </button>
        ));
    };

    return (
        <DialogContext.Provider value={{ openDialog, openDialogEx}}>
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
                            {renderButtons()}
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
