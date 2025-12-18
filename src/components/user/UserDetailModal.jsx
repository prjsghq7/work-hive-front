export default function UserDetailModal({ targetIndex, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">회원 상세</h3>
                    <span className="modal-stretch"></span>
                    <button type="button" className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <span>
                        targetIndex={targetIndex}
                        샘플데이터
                        샘플데이터
                        샘플데이터
                        샘플데이터
                    </span>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="-button --blue"
                        onClick={onClose}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
