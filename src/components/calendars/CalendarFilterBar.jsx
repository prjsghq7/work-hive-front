// CalendarFilterBar.jsx
import "./Calendar.css";

export default function CalendarFilterBar({ filter, onChangeFilter, labels }) {
    return (
        <div className="custom-filter-box">
            {labels.map(label => (
                <span
                    key={label}
                    className={`filter-label ${filter === label ? "active" : ""}`}
                    onClick={() => onChangeFilter(label)}
                >
                    {label}
                </span>
            ))}
        </div>
    );
}