// CalendarFilterBar.jsx

export default function CalendarFilterBar({ filter, onChangeFilter, labels, labelClassName = "-object-radio-label-underline", className = "" }) {
    return (
        <div className={className}>
            {labels.map(label => (
                <label
                    key={label}
                    className={`${labelClassName} ${filter === label ? "active" : ""}`}
                >
                    <input
                        type="radio"
                        name="calendarFilter"
                        value={label}
                        checked={filter === label}
                        onChange={() => onChangeFilter(label)}
                        className="-object-radio"
                    />
                    {label}
                </label>
            ))}
        </div>
    );
}