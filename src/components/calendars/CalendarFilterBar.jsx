// CalendarFilterBar.jsx

export default function CalendarFilterBar({ filter, onChangeFilter, labels, labelClassName = "-radio-label-underline", className = "" }) {
    // labels가 객체 배열인지 문자열 배열인지 확인
    const isObjectArray = labels.length > 0 && typeof labels[0] === 'object' && labels[0] !== null && labels[0].value !== undefined;
    
    return (
        <div className={className}>
            {labels.map(item => {
                // 객체 형태인 경우 {value, label}, 문자열인 경우 그대로 사용
                const value = isObjectArray ? item.value : item;
                const label = isObjectArray ? item.label : item;
                const key = isObjectArray ? item.value : item;
                
                return (
                    <label
                        key={key}
                        className={`${labelClassName} ${filter === value ? "active" : ""}`}
                    >
                        <input
                            type="radio"
                            name="calendarFilter"
                            value={value}
                            checked={filter === value}
                            onChange={() => onChangeFilter(value)}
                            className="-radio"
                        />
                        {label}
                    </label>
                );
            })}
        </div>
    );
}