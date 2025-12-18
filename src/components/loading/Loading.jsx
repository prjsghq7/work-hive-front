import "./Loading.min.css"

export default function Loading({message = "로딩중..."}) {
    return (
        <div className="loading-container">
            <div className="spinner">
            </div>
            <p>{message}</p>
        </div>
    )
}