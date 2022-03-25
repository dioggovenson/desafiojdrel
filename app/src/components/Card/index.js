import './card.css'
const Card = ({ classCard = '', header, body, footer }) => {
  return (
    <div className="card ">
      <div className={`card-container ${classCard}`}>
        <div className="card-header">{header}</div>
        <div className="card-body">{body}</div>
        <div className="card-footer">{footer}</div>
      </div>
    </div>
  )
}
export default Card
