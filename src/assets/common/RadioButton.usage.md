# 라디오 버튼 공용 디자인 사용 가이드

## 방법 1: CalendarFilterBar 컴포넌트 사용 (추천)

가장 간단한 방법입니다.

```jsx
import CalendarFilterBar from "../../components/calendars/CalendarFilterBar.jsx";
import "../../assets/common/RadioButton.scss"; // 또는 컴포넌트에서 이미 import됨

function MyComponent() {
    const [filter, setFilter] = useState("옵션1");
    
    return (
        <div className="my-custom-container">
            <CalendarFilterBar
                filter={filter}
                onChangeFilter={setFilter}
                labels={["옵션1", "옵션2", "옵션3"]}
                labelClassName="-object-radio-label-underline" // 또는 "-object-radio-label-bordered"
                className="my-filter-container" // div 스타일은 자체 작성
            />
        </div>
    );
}
```

## 방법 2: 직접 HTML 작성 (더 유연함)

컴포넌트 없이 직접 사용하는 방법입니다.

```jsx
import "../../assets/common/RadioButton.scss";

function MyComponent() {
    const [selected, setSelected] = useState("옵션1");
    
    return (
        <div className="my-custom-container">
            <label className={`-object-radio-label-underline ${selected === "옵션1" ? "active" : ""}`}>
                <input
                    type="radio"
                    name="myRadio"
                    value="옵션1"
                    checked={selected === "옵션1"}
                    onChange={(e) => setSelected(e.target.value)}
                    className="-object-radio"
                />
                옵션1
            </label>
            
            <label className={`-object-radio-label-underline ${selected === "옵션2" ? "active" : ""}`}>
                <input
                    type="radio"
                    name="myRadio"
                    value="옵션2"
                    checked={selected === "옵션2"}
                    onChange={(e) => setSelected(e.target.value)}
                    className="-object-radio"
                />
                옵션2
            </label>
        </div>
    );
}
```

## 사용 가능한 클래스명

### Label 스타일 (둘 중 하나 선택)
- `-object-radio-label-underline`: 밑줄 스타일
- `-object-radio-label-bordered`: 테두리 스타일

### Input 스타일 (필수)
- `-object-radio`: 라디오 버튼 숨김 처리

### 활성화 상태
- `active`: 선택된 항목에 추가 (label에 `active` 클래스 추가)

## 예시: 밑줄 스타일

```jsx
<label className="-object-radio-label-underline active">
    <input type="radio" className="-object-radio" />
    선택된 항목
</label>
```

## 예시: 테두리 스타일

```jsx
<label className="-object-radio-label-bordered active">
    <input type="radio" className="-object-radio" />
    선택된 항목
</label>
```

## 주의사항

1. **RadioButton.scss import 필수**: 스타일을 사용하려면 반드시 import 해야 합니다.
2. **div 스타일은 자체 작성**: 컨테이너 div의 레이아웃은 각 컴포넌트에서 자유롭게 작성합니다.
3. **name 속성**: 같은 그룹의 라디오 버튼은 동일한 `name` 값을 사용해야 합니다.
4. **active 클래스**: 선택된 항목의 label에만 `active` 클래스를 추가해야 스타일이 적용됩니다.

